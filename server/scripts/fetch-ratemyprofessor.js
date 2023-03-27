const rateMyProfessor = require('../services/ratemyprofessor');
const purdueDirectory = require('../services/purdue-directory');

const Instructor = require('../models/instructorModel');
const Semester = require('../models/semesterModel');
const Course = require('../models/courseModel');
const { RateMyProfRating } = require('../models/ratingModel');

const sleep = require('../utils/sleep');
const { nicknames, similarNames } = require('../utils/names');
const { parseFullName } = require('parse-full-name');


const toTitleCase = src => {
    return src.replace(/\w\S*/g, t => t[0].toUpperCase() + t.slice(1));
};

const queryInstructor = async (firstname, lastname, isNickname=false) => {
    const lastPunctuationRegex = new RegExp('\\b' + lastname.replace(/\W/g, '\\W*') + '\\b', 'i');
    let result = await Instructor.find({
        firstname: new RegExp('\\b' + firstname.replace(/\W/g, '\\W*'), 'i'),
        lastname: lastPunctuationRegex
    });

    if (result.length === 1)
        return result[0];

    // too many found, try to narrow our regular expressions;
    const firstRegex = new RegExp('\\b' + firstname + '\\b', 'i');
    const firstUnboundRegex = new RegExp('\\b' + firstname, 'i');
    const firstPunctuationRegex = new RegExp('\\b' + firstname.replace(/\W/g, '\\W*') + '\\b', 'i');
    const lastRegex = new RegExp('\\b' + lastname + '\\b', 'i');

    const conditions = [
        instructor => firstPunctuationRegex.test(instructor.firstname) && lastPunctuationRegex.test(instructor.lastname),
        instructor => firstUnboundRegex.test(instructor.firstname) && lastRegex.test(instructor.lastname),
        instructor => firstRegex.test(instructor.firstname) && lastRegex.test(instructor.lastname),
        instructor => instructor.firstname === firstname && instructor.lastname === lastname
    ];

    for (const condition of conditions) {
        const filtered = result.filter(condition);
        if (filtered.length === 1)
            return filtered[0];
    }

    // abbreviation
    if (/^[A-Z]\.?[A-Z]\.?/.test(firstname)) {
        const [, firstInitial, secondInitial] = firstname.match(/^([A-Z])\.?([A-Z])\.?/);

        result = await Instructor.find({
            firstname: new RegExp(`^\\b${firstInitial}\\w*\\s+${secondInitial}`, 'i'),
            lastname: new RegExp('\\b' + lastname.replace(/\W/g, '\\W*') + '\\b', 'i')
        });

        if (result.length === 1)
            return result[0];

        for (const condition of conditions) {
            const filtered = result.filter(condition);
            if (filtered.length === 1)
                return filtered[0];
        }
    }

    if (firstname.toLowerCase() in nicknames && !isNickname) {
        for (const nick of nicknames[firstname.toLowerCase()]) {
            const res = await queryInstructor(nick, lastname, true);

            if (res) {
                if (!res.nickname) {
                    res.nickname = toTitleCase(firstname);
                }

                return res;
            }
        }
    }

    // misspelled
    if (firstname.toLowerCase() in similarNames && !isNickname) {
        for (const nick of similarNames[firstname.toLowerCase()]) {
            const res = await queryInstructor(nick, lastname, true);

            if (res) {
                return res;
            }
        }
    }

    // double barrelled name, try search by each component
    if (lastname.includes('-')) {
        for (const last of lastname.split(/-/g)) {
            const res = await queryInstructor(firstname, last);

            if (res) return res;
        }
    }

    const regexPairs = [
        // may be missing some punctuation
        [
            new RegExp('\\b' + firstname.split('').join('\\W?') + '\\b', 'i'),
            new RegExp('\\b' + lastname.split('').join('\\W?') + '\\b', 'i')
        ],
        // misspelled: missing repeated letters
        [
            new RegExp('\\b' + firstname.split('')
                .map(l => /[a-z]/i.test(l) ? `${l}+` : l).join('') + '\\b', 'i'),
            new RegExp('\\b' + lastname.split('')
                .map(l => /[a-z]/i.test(l) ? `${l}+` : l).join('') + '\\b', 'i')
        ]
    ];

    for (const [first, last] of regexPairs) {
        result = await Instructor.find({
            firstname: first,
            lastname: last
        });

        if (result.length === 1)
            return result[0];

        // too many, try narrowing
        const narrowingConditions = [
            instructor => firstRegex.test(instructor.firstname),
            instructor => lastRegex.test(instructor.lastname),
            instructor => instructor.firstname === firstname,
            instructor => instructor.lastname === lastname
        ];

        for (const condition of narrowingConditions) {
            const filtered = result.filter(condition)
            if (filtered.length === 1)
                return filtered[0];
        }
    }

    // try search by last name only
    result = await Instructor.find({
        lastname: lastRegex
    });
    result = result.filter(instructor => instructor.firstname.toLowerCase().includes(firstname.toLowerCase()) ||
        firstname.toLowerCase().includes(instructor.firstname.toLowerCase()));

    if (result.length === 1)
        return result[0];

    return null;
}


const findInstructor = async ({ firstName, lastName, ratings, legacyId }, earliestYear) => {
    if (!ratings.edges.length) return false; // dont bother finding instructors with no ratings
    let instructor = null;

    instructor = await Instructor.findOne({
        rateMyProfIds: legacyId.toString()
    });

    if (instructor) return instructor;

    const names = parseFullName(`${firstName} ${lastName}`);

    const latestReviewYear = Math.max(...ratings.edges
        .map(({ node }) => new Date(node.date).getFullYear()));

    instructor = await queryInstructor(names.first, names.last);

    if (names.nick && !instructor)
        instructor = await queryInstructor(names.nick, names.last);

    if (instructor) {
        instructor.rateMyProfIds = [...instructor.rateMyProfIds, legacyId.toString()];
    }

    // this instructor may not work at purdue anymore, dont bother fetching if reviews are too old
    if (!instructor && latestReviewYear <= earliestYear)
        return false;

    return instructor;
};

const parseAttendanceMandatory = str => {
    str = str.toLowerCase();

    if (['y', 'mandatory'].includes(str)) return true;
    if (['n', 'non mandatory'].includes(str)) return false;
    return null;
};

const parseGrade = str => {
    if (/^(?:[A-D][-+]?|[EFPNSIWU]|(?:PI|PO|IN|WN|IX|WF|SI|IU|WU|AU|CR|NS))$/.test(str)) return str;
    str = str.toLowerCase();
    if (str === 'pass') return 'P';
    if (str === 'fail') return 'F';
    return null;
};


module.exports = async ({ batchSize = 16 } = {}) => {
    console.log('fetching data from ratemyprofessor');

    // ratemyprofessor is very inconsistent about how many ratings it returns
    // fetch multiple times and use the highest amount returned
    const result = await Promise.allSettled([...new Array(8)]
        .map(() => rateMyProfessor.getRatings()));

    if (result.every(({ status }) => status === 'rejected')) {
        console.log('failed to fetch ratemyprofessor:', result[0].reason);
        return;
    }

    const ratings = result.reduce((finalResult, currentResult) => {
        if (currentResult.status === 'rejected') return finalResult;
        const currentCount = currentResult.value.search.teachers.edges.length;
        const finalCount = finalResult?.search?.teachers?.edges?.length ?? 0;
        return currentCount > finalCount ? currentResult.value : finalResult;
    }, null);

    const semesters = await Semester.find();
    const earliestYear = Math.min(...semesters.map(s => s.year));

    console.log('querying database for instructors')

    const searchInstructorIndices = [];
    const instructorResult = await Promise.all(ratings.search.teachers.edges.map(async ({ node }, i) => {
        const result = await findInstructor(node, earliestYear);

        if (result === null)
            searchInstructorIndices.push(i);

        return [node, result];
    }));

    if (searchInstructorIndices.length)
        console.log('unable to find', searchInstructorIndices.length, 'instructors, querying purdue directory');

    await Promise.all([...new Array(batchSize)].map(async () => {
        let index;

        while (index = searchInstructorIndices.pop()) {
            await sleep(1000);

            let directoryEntries;
            const { node } = ratings.search.teachers.edges[index];
            const name = `${node.firstName} ${node.lastName}`.replace(/[^\w. '@-]/g, '');

            try {
                directoryEntries = await purdueDirectory.search({ name });
            } catch (e) {
                console.log('failed to fetch data from purdue directory for', name, ':', e.message,
                    '; falling back to old directory')
            }

            if (!directoryEntries) {
                try {
                    directoryEntries = await purdueDirectory.oldSearch({ name });
                } catch (e) {
                    console.log('failed to fetch data from old directory for', name, ':', e.message);
                    continue;
                }
            }

            let directoryData = null;

            if (directoryEntries.length === 1)
                directoryData = directoryEntries[0];
            if (directoryEntries.length > 1) {
                const entries = directoryEntries.filter(entry => {
                    if (!entry.department) return false;
                    const stopwords = /engineering|department/ig;

                    const entryDepartmentParts = entry.department.replace(stopwords, '')
                        .toLowerCase().match(/\w{4,}/g);

                    const teacherDepartmentParts = node.department.replace(stopwords, '')
                        .toLowerCase().match(/\w{4,}/g);

                    // try to match by same department
                    return entryDepartmentParts?.some(entry => teacherDepartmentParts?.includes(entry));
                });

                if (entries.length === 1)
                    directoryData = entries[0];

                if (entries.length > 1) {
                    console.error('failed to find instructor for', name, ': too many entries matched');
                    continue;
                }
            }

            let instructor;

            if (directoryData?.email)
                instructor = await Instructor.findOne({ email: directoryData.email });

            if (directoryData?.alias && !instructor)
                instructor = await Instructor.findOne({ email: `${directoryData.alias}@purdue.edu` });

            // create new entry
            if (!instructor && (directoryData?.email || directoryData?.alias) && directoryData?.name) {
                const nameParts = parseFullName(directoryData.name);

                instructor = new Instructor({
                    email: directoryData?.alias ? `${directoryData.alias}@purdue.edu` : directoryData.email,
                    firstname: nameParts.first,
                    lastname: nameParts.last,
                });
            }

            if (instructor) {
                if (!instructor.nickname && directoryData?.nickname)
                    instructor.nickname = toTitleCase(directoryData.nickname);

                instructor.rateMyProfIds = [...instructor.rateMyProfIds, node.legacyId.toString()];
                instructorResult[index][1] = instructor;
            }
        }
    }));

    // combine identical ids into same object to ensure consistent saves
    const instructorIdMap = {};
    instructorResult.forEach(([_, instructor], i) => {
        const id = instructor?._id?.toString();

        if (id && (id in instructorIdMap)) {
            const otherInstructor = instructorIdMap[id];
            otherInstructor.rateMyProfIds = [...new Set([
                ...otherInstructor.rateMyProfIds,
                ...instructor.rateMyProfIds
            ])];
            if (!otherInstructor.nickname && instructor.nickname)
                otherInstructor.nickname = instructor.nickname;

            instructorResult[i][1] = otherInstructor;
            instructor = otherInstructor;
        }

        if (id && !(id in instructorIdMap)) {
            instructorIdMap[id] = instructor;
        }
    });

    const savedIds = new Set();

    await Promise.all(instructorResult.map(([_, instructor], i) => {
        if (instructor && (instructor.isModified() || instructor.$isNew) && !savedIds.has(instructor._id.toString())) {
            savedIds.add(instructor._id.toString());
            return instructor.save();
        }
    }))

    let failedInstructorCount = 0;
    instructorResult.filter(([_, res]) => res === null).forEach(([node]) => {
        ++failedInstructorCount;
        console.log('failed to find instructor for', node.firstName, node.lastName);
    })

    console.log('queried', ratings.search.teachers.edges.length, 'instructors, of which',
        failedInstructorCount, 'failed to map');

    // build which courses we need to query
    const reviewToCourseIdMap = {};
    ratings.search.teachers.edges.forEach(({ node: teacher }) => {
        const ratings = teacher.ratings.edges;
        if (!ratings.length) return;

        ratings.forEach(({ node: rating }) => {
            reviewToCourseIdMap[rating.id] = Course.parseCourseString(rating.class, true);
        });

        // find if all courses this teacher has are the same subject
        let commonSubject = ratings
            .filter(({ node: rating }) => reviewToCourseIdMap[rating.id]?.subject);

        commonSubject = commonSubject
            .reduce((t, x) => x.subject === t ? t : null,
                commonSubject[0]?.subject ?? null);

        ratings.forEach(({ node: rating }) => {
            if (reviewToCourseIdMap[rating.id] && !reviewToCourseIdMap[rating.id].subject) {
                // teacher only has one subject, fix reviews that have only course number and no subject
                if (commonSubject)
                    reviewToCourseIdMap[rating.id].subject = commonSubject;
                else
                    reviewToCourseIdMap[rating.id] = null;
            }
        });
    });

    const courses = await Course.find({
        $or: Object.values(reviewToCourseIdMap)
            .filter(x => x)
    });

    const courseIdMap = {};
    courses.forEach(course => {
        courseIdMap[[course.subject, course.courseID]] = course;
    });

    console.log('removing old ratings...');

    // remove deleted reviews
    await RateMyProfRating.deleteMany({
        typeSpecificId: {
            $nin: Object.keys(reviewToCourseIdMap)
        }
    });

    const updates = instructorResult.filter(([, instructor]) => instructor)
        .flatMap(([teacher, instructor]) => {
        return teacher.ratings.edges.map(({ node: rating }) => {
            const parsedCourse = reviewToCourseIdMap[rating.id];
            const course = parsedCourse ? courseIdMap[[parsedCourse.subject, parsedCourse.courseID]] : null;

            return {
                updateOne: {
                    filter: {
                        type: 'ratemyprofessor',
                        typeSpecificId: rating.id
                    },
                    update: { $set: {
                        instructor: instructor._id,
                        course: course?._id ?? null,
                        quality: rating.helpfulRatingRounded,
                        difficulty: rating.difficultyRatingRounded,
                        review: rating.comment,
                        tags: rating.ratingTags.toLowerCase().split(/--/g).filter(x => x),
                        isForCredit: rating.isForCredit,
                        isForOnlineClass: rating.isForOnlineClass,
                        isTextbookUsed: rating.textbookIsUsed,
                        wouldTakeAgain: rating.iWouldTakeAgain,
                        isAttendanceMandatory: parseAttendanceMandatory(rating.attendanceMandatory),
                        grade: parseGrade(rating.grade)
                    }},
                    upsert: true
                }
            };
        });
    });

    console.log('updating new ratings...');
    console.log('this may take a long time:', updates.length, 'reviews to be processed');
    await RateMyProfRating.bulkWrite(updates, { ordered: false });

    console.log('updated ratemyprofessor ratings');
};

