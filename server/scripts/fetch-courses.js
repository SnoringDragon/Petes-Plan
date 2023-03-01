const selfService = require('../services/banner-self-service');
const sleep = require('../utils/sleep');
const Course = require('../models/courseModel');
const ProcessedCourse = require('../models/processedCoursesModel');

const computeCourseSearchString = (subject, courseNumber) => {
    if (typeof courseNumber === 'number') courseNumber = `${courseNumber}`;

    let str = [`${subject} ${courseNumber}`, `${subject}${courseNumber}`]; // for full course number searches

    // ends in 00 -> add short course number (e.g. CS 18000 -> CS 180)
    if (courseNumber.slice(-2) === '00') {
        const num = courseNumber.slice(0, 3);
        str.push(`${subject} ${num}`, `${subject}${num}`);
    }

    // all zeros and ends in a single number -> convert to 'k' format (e.g. ECE 20001 -> ECE 2k1)
    if (/^\d0{3}[1-9]$/.test(courseNumber)) {
        const num = `${courseNumber[0]}k${courseNumber[4]}`;
        str.push(`${subject} ${num}`, `${subject}${num}`);
    }

    return str.join(' ');
};

async function fetchIndividualSubject(term, subject, colleges) {
    console.log('fetching term', term.name, 'subject', subject.name);

    const [courseList, requisiteResults, /*restrictions*/] = await Promise.all([
        selfService.getCourseList({
            term: term.value,
            subjects: [subject.value],
            colleges: colleges.map(c => c.value) // this allows us to filter west lafayette-only courses
        }),
        selfService.getPrerequisites({term: term.value, subject: subject.value}),
        // selfService.getRestrictions({term: term.value, subject: subject.value})
    ]);

    const requisiteMap = new Map();

    // create map for easier searching
    requisiteResults.requisites.forEach(data => {
        requisiteMap[data.courseNumber] = JSON.parse(JSON.stringify(data.requisites)); // bad hack to convert to raw object
    });

    requisiteResults.failed.forEach(data => {
        console.error('[ERR] failed to parse requisites for', term.name, data.subject, data.courseNumber, data.name,
            ':', data.error.message);
    });

    await Course.bulkWrite(courseList.map(course => ({
        updateOne: {
            filter: { subject: subject.value, courseID: course.number },
            update: { '$setOnInsert': {
                subject: subject.value,
                courseID: course.number,
                name: course.longTitle ?? course.shortTitle,
                    searchCourseID: computeCourseSearchString(subject.value, course.number),
                minCredits: course.minCredits,
                maxCredits: course.maxCredits,
                attributes: course.attributes,
                description: course.description,
                requirements: requisiteMap[course.number] ?? null
            }},
            upsert: true
        }
    })));

    await ProcessedCourse.create({
        subject: subject.value, semester: term.value
    });

    console.log('successfully parsed course data for semester', term.name, 'subject', subject.value);
}

module.exports = async ({ batchSize = 7, sleepTime = 750, numYears = 2 } = {}) => {
    const terms = await selfService.getCatalogTerms();

    const alreadyProcessed = await ProcessedCourse.find().lean();

    for (const term of terms) {
        if (term.value.slice(0, 4) <= new Date().getFullYear() - numYears)
            continue;

        const options = await selfService.getOptionsForTerm(term.value);

        // only fetch subjects we have not fetched yet for this semester
        options.subjects = options.subjects.filter(({ value }) =>
            alreadyProcessed.findIndex(processed => processed.subject === value && processed.semester === term.value) === -1)

        await Promise.all([...new Array(batchSize)].map(async () => {
            while (options.subjects.length) {
                const subject = options.subjects.shift(); // get next subject to process

                try {
                    await fetchIndividualSubject(term, subject, options.colleges);
                } catch (e) {
                    console.error('[ERR] failed to write course data for', term.name, subject.value, ':', e);
                }
                await sleep(sleepTime);
            }
        }));
    }

    console.log('finished course sync');
};