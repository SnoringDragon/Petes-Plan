const { parseFullName } = require('parse-full-name');

const selfService = require('../services/banner-self-service');
const sleep = require('../utils/sleep');
const Course = require('../models/courseModel');
const Section = require('../models/sectionModel');
const Instructor = require('../models/instructorModel');
const ProcessedCourse = require('../models/processedCoursesModel');
const Semester = require('../models/semesterModel');

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

async function fetchIndividualSubject(term, subject, colleges, semesterId) {
    console.log('fetching term', term.name, 'subject', subject.name);

    const [courseList, requisiteResults, restrictions, professors, sections] = await Promise.all([
        selfService.getCourseList({
            term: term.value,
            subjects: [subject.value],
            colleges: colleges.map(c => c.value) // this allows us to filter west lafayette-only courses
        }),
        selfService.getPrerequisites({term: term.value, subject: subject.value}),
        selfService.getRestrictions({term: term.value, subject: subject.value}),
        selfService.getProfessorsForTerm(term.value),
        selfService.getSections({term: term.value, subject: subject.value})
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

    const courseWriteResult = await Course.bulkWrite(courseList.map(course => ({
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

    if (!courseWriteResult.result.ok) {
        console.error(courseWriteResult);
        throw new Error('course bulk write failed')
    }

    const courseIDList = await Course.find({
        $or: courseList.map(course => ({
            courseID: course.number,
            subject: subject.value
        }))
    });

    const courseIDs = {};

    courseIDList.forEach(course => {
        courseIDs[course.courseID] = course._id;
    });

    const sectionInstructors = sections.map(section => section.scheduledMeetings.map(meeting => meeting.instructors))
        .flat(Infinity)
        .filter(instructor => instructor);

    const instructorFilters = [];
    const nameToPartsMap = {};

    const instructorWriteResult = await Instructor.bulkWrite(sectionInstructors.map(instructor => {
        const professor = professors
            .find(prof => instructor.name === `${prof.first} ${prof.last}`);

        let last;
        let first;

        if (professor) {
            ({ last, first } = professor);
        } else {
            const parsed = parseFullName(instructor.name);
            last = parsed.last;
            first = `${parsed.first} ${parsed.middle}`.trim();
        }

        nameToPartsMap[[first, last]] = instructor.name;

        const filter = instructor.email ? ({ email: instructor.email }) : ({ firstname: first, lastname: last });

        instructorFilters.push(filter);

        return {
            updateOne: {
                filter,
                update: { $set: { firstname: first, lastname: last } },
                upsert: true
            }
        };
    }));

    if (!instructorWriteResult.result.ok) {
        console.error(instructorWriteResult);
        throw new Error('instructor bulk write failed')
    }

    const instructorList = await Instructor.find({
        $or: instructorFilters
    });

    const instructorIDs = {};
    instructorList.forEach(instructor => {
        instructorIDs[nameToPartsMap[[instructor.firstname, instructor.lastname]]] = instructor._id;
    });

    const sectionWriteResult = await Section.bulkWrite(sections.map(section => ({
        updateOne: {
            filter: {
                crn: section.crn,
                semester: semesterId,
            },
            update: { $set: {
                course: courseIDs[section.courseID],
                name: section.sectionName,
                credits: section.credits,
                isHybrid: section.isHybrid,
                sectionID: section.sectionID,
                requires: section.requiredSection,
                linkID: section.linkID,
                meetings: section.scheduledMeetings.map(meeting => ({
                    startDate: meeting.startDate,
                    endDate: meeting.endDate,
                    days: meeting.days,
                    startTime: meeting.startTime,
                    endTime: meeting.endTime,
                    location: meeting.location,
                    instructors: meeting.instructors?.map(({ name }) => instructorIDs[name]) ?? null
                }))
            }},
            upsert: true
        }
    })));

    if (!sectionWriteResult.result.ok) {
        console.error(sectionWriteResult);
        throw new Error('section bulk write failed')
    }

    console.log('successfully parsed course data for semester', term.name, 'subject', subject.value);
}

module.exports = async ({ batchSize = 10, sleepTime = 750, numYears = 6 } = {}) => {
    let terms = await selfService.getCatalogTerms();
    const viewOnlyTerms = await selfService.getViewOnlyTerms();

    terms = terms.filter(term => term.value.slice(0, 4) > new Date().getFullYear() - numYears);

    const alreadyProcessed = await ProcessedCourse.find().lean();

    for (const term of terms) {
        const [semesterType, semesterYear] = term.name.split(/\s+/);

        if (isNaN(semesterYear) || !['Spring', 'Fall', 'Winter', 'Summer'].includes(semesterType)) {
            console.log('unknown semester type', semesterType);
            continue;
        }

        const semesterModel = await Semester.findOneAndUpdate({
            semester: semesterType,
            year: +semesterYear,
        }, { term: term.value }, {
            new: true,
            upsert: true
        });

        const options = await selfService.getOptionsForTerm(term.value);

        const isViewOnly = viewOnlyTerms.includes(term.value);

        // only fetch view only terms once, since they will not be modified
        if (isViewOnly) {
            // only fetch subjects we have not fetched yet for this semester
            options.subjects = options.subjects.filter(({value}) =>
                alreadyProcessed.findIndex(processed => processed.subject === value && processed.semester === term.value) === -1)
        }

        await Promise.all([...new Array(batchSize)].map(async () => {
            while (options.subjects.length) {
                const subject = options.subjects.shift(); // get next subject to process

                try {
                    await fetchIndividualSubject(term, subject, options.colleges, semesterModel._id);

                    const processedCourse = await ProcessedCourse.findOne({
                        subject: subject.value, semester: term.value
                    });

                    if (!processedCourse) {
                        await ProcessedCourse.create({
                            subject: subject.value, semester: term.value
                        });
                    } else {
                        processedCourse.markModified('subject');
                        await processedCourse.save();
                    }
                } catch (e) {
                    console.error('[ERR] failed to write course data for', term.name, subject.value, ':', e);
                }
                await sleep(sleepTime);
            }
        }));

        await sleep(sleepTime);
    }

    console.log('finished course sync');
};