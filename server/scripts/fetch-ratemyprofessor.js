const rateMyProfessor = require('../services/ratemyprofessor');
const purdueDirectory = require('../services/purdue-directory');

const Instructor = require('../models/instructorModel');
const Semester = require('../models/semesterModel');
const Course = require('../models/courseModel');
const { RateMyProfRating } = require('../models/ratingModel');

const sleep = require('../utils/sleep');
const toTitleCase = require('../utils/title-case');
const { parseFullName } = require('parse-full-name');
const { decode } = require('html-entities');
const race = require('race-as-promised');
const queryInstructor = require('../utils/query-instructor');

const findInstructor = async ({ firstName, lastName, ratings, legacyId }, earliestYear, abortPromise) => {
    if (!ratings.edges.length) return false; // dont bother finding instructors with no ratings
    let instructor = null;

    instructor = await race([Instructor.findOne({
        rateMyProfIds: legacyId.toString()
    }), abortPromise]);

    if (instructor) {
        return instructor;
    }

    const names = parseFullName(`${firstName} ${lastName}`);

    const latestReviewYear = Math.max(...ratings.edges
        .map(({ node }) => new Date(node.date).getFullYear()));

    instructor = await race([queryInstructor(names.first, names.last, false, abortPromise), abortPromise]);

    if (names.nick && !instructor)
        instructor = await race([queryInstructor(names.nick, names.last, true, abortPromise), abortPromise]);

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


module.exports = async ({ batchSize = 16, abort = new AbortController(), log = console.log, error = console.error } = {}) => {
    log('fetching data from ratemyprofessor');

    // ratemyprofessor is very inconsistent about how many ratings it returns
    // fetch multiple times and use the highest amount returned
    const result = await Promise.allSettled([...new Array(8)]
        .map(() => rateMyProfessor.getRatings({}, { signal: abort.signal })));

    if (result.every(({ status }) => status === 'rejected')) {
        log('failed to fetch ratemyprofessor:', result[0].reason);
        return;
    }

    const ratings = result.reduce((finalResult, currentResult) => {
        if (currentResult.status === 'rejected') return finalResult;
        const currentCount = currentResult.value.search.teachers.edges.length;
        const finalCount = finalResult?.search?.teachers?.edges?.length ?? 0;
        return currentCount > finalCount ? currentResult.value : finalResult;
    }, null);

    let listener;
    const abortPromise = new Promise((_, reject) => abort.signal.addEventListener('abort', listener = reject));

    const semesters = await race([Semester.find(), abortPromise]);
    const earliestYear = Math.min(...semesters.map(s => s.year));

    log('querying database for instructors');

    const searchInstructorIndices = [];
    const instructorResult = await Promise.all(ratings.search.teachers.edges.map(async ({ node }, i) => {
        const result = await findInstructor(node, earliestYear, abortPromise);

        if (result === null)
            searchInstructorIndices.push(i);

        return [node, result];
    }));

    if (searchInstructorIndices.length)
        log('unable to find', searchInstructorIndices.length, 'instructors, querying purdue directory');

    await Promise.all([...new Array(batchSize)].map(async () => {
        let index;

        while ((index = searchInstructorIndices.pop()) !== undefined && !abort.signal.aborted) {
            await race([sleep(1000), abortPromise]);

            let directoryEntries;
            const { node } = ratings.search.teachers.edges[index];
            const name = `${node.firstName} ${node.lastName}`.replace(/[^\w. '@-]/g, '');

            try {
                directoryEntries = await race([purdueDirectory.search({ name }), abortPromise]);
            } catch (e) {
                log('failed to fetch data from purdue directory for', name, ':', e.message,
                    '; falling back to old directory')
            }

            if (!directoryEntries) {
                try {
                    directoryEntries = await race([purdueDirectory.oldSearch({ name }), abortPromise]);
                } catch (e) {
                    log('failed to fetch data from old directory for', name, ':', e.message);
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
                    error('failed to find instructor for', name, ': too many entries matched');
                    continue;
                }
            }

            let instructor;

            if (directoryData?.email)
                instructor = await race([Instructor.findOne({ email: directoryData.email }), abortPromise]);

            if (directoryData?.alias && !instructor)
                instructor = await race([Instructor.findOne({ email: `${directoryData.alias}@purdue.edu` }), abortPromise]);

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

    await race([Promise.all(instructorResult.map(([_, instructor], i) => {
        if (instructor && (instructor.isModified() || instructor.$isNew) && !savedIds.has(instructor._id.toString())) {
            savedIds.add(instructor._id.toString());
            return instructor.save();
        }
    })), abortPromise]);

    let failedInstructorCount = 0;
    instructorResult.filter(([_, res]) => res === null).forEach(([node]) => {
        ++failedInstructorCount;
        log('failed to find instructor for', node.firstName, node.lastName);
    })

    log('queried', ratings.search.teachers.edges.length, 'instructors, of which',
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

    const courses = await race([Course.find({
        $or: Object.values(reviewToCourseIdMap)
            .filter(x => x)
    }), abortPromise]);

    const courseIdMap = {};
    courses.forEach(course => {
        courseIdMap[[course.subject, course.courseID]] = course;
    });

    log('removing old ratings...');

    // remove deleted reviews
    await race([RateMyProfRating.deleteMany({
        typeSpecificId: {
            $nin: Object.keys(reviewToCourseIdMap)
        }
    }), abortPromise]);

    const updates = instructorResult.filter(([, instructor]) => instructor)
        .flatMap(([teacher, instructor]) => {
        return teacher.ratings.edges.map(({ node: rating }) => {
            const parsedCourse = reviewToCourseIdMap[rating.id];
            const course = parsedCourse ? courseIdMap[[parsedCourse.subject, parsedCourse.courseID]] : null;

            return {
                updateOne: {
                    timestamps: false,
                    filter: {
                        type: 'ratemyprofessor',
                        typeSpecificId: rating.id
                    },
                    update: { $set: {
                        createdAt: new Date(rating.date),
                        instructor: instructor._id,
                        course: course?._id ?? null,
                        quality: rating.helpfulRatingRounded,
                        difficulty: rating.difficultyRatingRounded,
                        review: decode(rating.comment),
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

    log('updating new ratings...');
    log('this may take a long time:', updates.length, 'reviews to be processed');
    const bulkWriteResult = await race([
        RateMyProfRating.bulkWrite(updates, { ordered: false }),
        abortPromise
    ]);

    await race([RateMyProfRating.updateMany({
        _id: {
            $in: [...bulkWriteResult.getInsertedIds(), ...bulkWriteResult.getUpsertedIds()]
                .map(({ _id }) => _id)
        }
    }, {
        updatedAt: new Date()
    }, { timestamps: false }), abortPromise]);
    abort.signal.removeEventListener('abort', listener);
    log('updated ratemyprofessor ratings');
};

