const mongoose = require('mongoose');

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

// unique index on combination of subject and courseID; faster search and prevent duplicates
courseSchema.index({ subject: 1, courseID: 1 }, { unique: true });

// text index on name, description, and search fields
/* example search:
await courseModel.find({
    $text: { $search: 'cryptography' }
}).sort({
    score: { $meta: 'textScore' }
})
 */
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
