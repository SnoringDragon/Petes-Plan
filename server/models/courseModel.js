const mongoose = require('mongoose');
const StaticDisjointSet = require('mnemonist/static-disjoint-set');

const Section = require('./sectionModel');

let model;

//Includes schemas for: course, userCourse, semester, instructor, section

/* Resources: https://mongoosejs.com/docs/guide.html#definition */
/* https://stackoverflow.com/questions/43534461/array-of-subdocuments-in-mongoose */ 

const courseAttributeSchema = new mongoose.Schema({
    code: String,
    name: String
}, { _id: false });

/* Create a course schema - US5 */
const courseSchema = new mongoose.Schema({
    name: String,

    subject: String, // CS, MA, etc.
    courseID: String, // 18000, 24000, etc

    // string of various ways to represent this course ID, used for search index
    // example: 'ECE 20001 ECE20001 ECE 2k1 ECE2k1']
    // example: 'CS 18000 CS18000 CS 180 CS180'
    searchCourseID: String,

    minCredits: Number,
    maxCredits: Number,

    // various attributes such as variable title, etc
    attributes: [courseAttributeSchema],

    description: String,
    requirements: Object,
    // semesters: { TODO: update this later when pulling scheduling info
    //     type: [semesterSchema],
    // }
});

// DFS to get list of course requirements
const getCoursesFromRequirements = requirements => {
    if (!requirements?.type) // invalid requirement object
        return [];
    if ('children' in requirements) // group, combine children courses
        return requirements.children.flatMap(child => getCoursesFromRequirements(child));
    if (requirements.type === 'course') // return single course
        return [{ courseID: requirements.courseID, subject: requirements.subject }];
    return [];
};

// DFS to assign course property
const assignRequirements = (requirements, reqCourseMap) => {
    if (!requirements?.type) return; // invalid requirement object
    if ('children' in requirements) // group, assign course property on children
        requirements.children.forEach(child => assignRequirements(child, reqCourseMap));
    if (requirements.type === 'course') // assign course property
        requirements.course = reqCourseMap[requirements.subject]?.[requirements.courseID] ?? null;
};

const populateRequirements = async (courses, depth = 1) => {
    if (depth < 1) return;

    // fetch courses in single batch (saves db access time)
    const reqCourses = courses.flatMap(c => getCoursesFromRequirements(c.requirements));
    const reqCourseModels = await model.find({ $or: reqCourses }).lean();

    const reqCourseMap = {};

    // recurse if we want to populate deeper requirements
    await populateRequirements(reqCourseModels, depth - 1);

    // create map for helper function
    reqCourseModels.forEach(course => {
        if (!(course.subject in reqCourseMap)) reqCourseMap[course.subject] = {};
        reqCourseMap[course.subject][course.courseID] = course;
    });

    // assign course property on requirements in courses
    courses.forEach(c => assignRequirements(c.requirements, reqCourseMap));
};

courseSchema.methods.populateRequirements = async function (depth = 1) {
    const obj = this.toObject(); // convert to object so our modifications don't get saved to database
    await populateRequirements([obj], depth);
    return obj;
}

courseSchema.query.populateRequirements = async function (depth = 1) {
    const result = await this.lean().exec(); // convert to object so our modifications don't get saved to database
    if (Array.isArray(result))
        await populateRequirements(result, depth);
    else
        await populateRequirements([result], depth);
    return result;
}

courseSchema.methods.getSections = async function (semester) {
    const sections = await Section.find({
        course: this._id,
        semester: '_id' in semester ? semester._id : semester
    });

    const groups = new StaticDisjointSet(sections.length);
    const linkIds = {};
    const nonLinkSections = [];
    const linkIdIndices = [];
    const getIndex = linkId => {
        const i = linkIdIndices.indexOf(linkId);

        if (i === -1) {
            linkIdIndices.push(linkId);
            return linkIdIndices.length - 1;
        }

        return i;
    };

    sections.forEach(section => {
        if (!section.linkID || !section.requires)
            return nonLinkSections.push(section);
        if (!(section.linkID in linkIds))
            linkIds[section.linkID] = [];
        linkIds[section.linkID].push(section);
        groups.union(getIndex(section.linkID), getIndex(section.requires));
    });

    return [...groups.compile()
        .filter(group => !(group.length === 1 && group[0] >= linkIdIndices.length))
        .map(group => group.map(i => linkIds[linkIdIndices[i]])),
        ...nonLinkSections.map(section => [section])];
}

courseSchema.statics.parseCourseString = function (str, allowPartial=false) {
    str = str.replace(/\p{P}/gu, '');
    let subject = null;
    let courseID = null;

    if (allowPartial) {
        [, subject, courseID] = str.match(/^([A-Z]+)?\s*(\d[A-Z\d]+)$/i) ?? [];
    } else {
        [, subject, courseID] = str.match(/^([A-Z]+)\s*(\d[A-Z\d]+)$/i) ?? [];
    }

    if (courseID) {
        // k -> 000 (e.g. ECE 2k1 -> ECE 20001
        courseID = courseID.replace(/k/ig, '000');

        // append trailing zeroes
        if (courseID.length === 3)
            courseID += '00';

        if (courseID.length !== 5)
            courseID = null;
    }

    if (!courseID)
        return null;

    if (!subject && !courseID)
        return null;

    return {
        subject: subject ?? null,
        courseID: courseID ?? null
    };
};

// unique index on combination of subject and courseID; faster search and prevent duplicates
courseSchema.index({ subject: 1, courseID: 1 }, { unique: true, background: false });

// text index on name, description, and search fields

courseSchema.index({
    name: 'text',
    searchCourseID: 'text',
    description: 'text'
}, {
    weights: { // arbitrarily chosen weights, higher is more important
        name: 3,
        searchCourseID: 50,
        description: 1
    }
})

module.exports = model = mongoose.model('Course', courseSchema);
