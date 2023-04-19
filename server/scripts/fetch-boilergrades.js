const race = require('race-as-promised');

const boilergrades = require('../services/boiler-grades');
const Boilergrades = require('../models/boilergradesModel');
const Course = require('../models/courseModel');
const Semester = require('../models/semesterModel');
const Section = require('../models/sectionModel');
const sleep = require('../utils/sleep');
const queryInstructor = require('../utils/query-instructor');
const {parseFullName} = require("parse-full-name");
const { makePromiseCache } = require('../utils/promise-cache');

const GRADES = {
    "a": "A",
    "a_minus": "A-",
    "a_plus": "A+",
    "au": "AU",
    "b": "B",
    "b_minus": "B-",
    "b_plus": "B+",
    "c": "C",
    "c_minus": "C-",
    "c_plus": "C+",
    "d": "D",
    "d_minus": "D-",
    "d_plus": "D+",
    "e": "E",
    "f": "F",
    // "fn": "FN",
    "i": "I",
    "i_f": "IF",
    "n": "N",
    "ns": "NS",
    "p": "P",
    "p_i": "PI",
    "s": "S",
    "s_i": "SI",
    "u": "U",
    "w": "W",
    "w_f": "WF",
    "w_n": "WN",
    "w_u": "WU"
};

const GPA = {
    'A+': 4,
    'A': 4,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1,
    'D-': .7,
    'F': 0,
    'E': 0,
    'IF': 0
};

const SORT = Object.fromEntries([
    'A+',
    'A',
    'A-',
    'B+',
    'B',
    'B-',
    'C+',
    'C',
    'C-',
    'D+',
    'D',
    'D-',
    'F',
    'E',
    'IF',

    'I',

    'P',
    'N',
    'PI',

    'S',
    'U',
    'SI',

    'W',
    'WF',
    'WN',
    'WU',

    'AU',
    'NS'
].map((key, i) => [key, i]));

module.exports = async ({ batchSize = 10, sleepTime = 250, abort = new AbortController(),
                            log = console.log,
                            error = console.error } = {}) => {
    let listener;
    const abortPromise = new Promise((_, reject) => abort.signal.addEventListener('abort', listener = reject));

    const subjects = await race([Course.distinct('subject'), abortPromise]);

    const terms = {};

    (await race([Semester.find(), abortPromise])).forEach(semester => {
        terms[semester.term] = semester;
    });

    const cachedQuery = makePromiseCache(queryInstructor);

    await Promise.all([...new Array(batchSize)].map(async () => {
        while (!abort.signal.aborted) {
            await sleep(sleepTime);

            const subject = subjects.pop();
            if (!subject) return;

            const grades = await race([boilergrades.getBGSubject(subject), abortPromise]);

            const data = await Promise.all(grades.map(async data => {
                const { subject, course_num, academic_period, crn, section, instructor } = data;

                if (!(academic_period in terms)) return;
                const semester = terms[academic_period];

                let { first, last } = parseFullName(instructor);

                if (!first || !last) {
                    const parts = instructor.split(', ');
                    last = parts[0];
                    first = parts[1].match(/^\S+/g)?.[0] ?? parts[1];
                }

                const [course, instructorModel] = await race([Promise.all([
                    Course.findOne({ subject, courseID: '' + course_num }),
                    cachedQuery(first, last, false, abortPromise)
                ]), abortPromise]);

                if (!course)
                    return error('failed to find course for', subject, course_num);

                if (!instructorModel)
                    return error('failed to find instructor for', instructor);

                const sectionModel = await race([Section.findOne({
                    crn,
                    semester: semester._id
                }), abortPromise]);

                if (!sectionModel)
                    return error('failed to find section for', academic_period, crn, subject, course_num);

                const grades = Object.fromEntries(Object.entries(data)
                    .filter(([key]) => key in GRADES)
                    .map(([key, value]) => [GRADES[key], parseFloat(value ?? 0)]));

                const total = Object.values(grades).reduce((t, x) => t + x);

                for (const key in grades)
                    grades[key] /= total;

                const gpa = {};
                Object.entries(grades)
                    .filter(([key]) => key in GPA)
                    .forEach(([key, value]) => {
                        gpa[GPA[key]] = (gpa[GPA[key]] ?? 0) + value;
                    });

                const gpaTotal = Object.values(gpa).reduce((t, x) => t + x);

                const gpaArray = Object.entries(gpa)
                    .map(([key, value]) => [+key, value / gpaTotal])
                    .sort(([a], [b]) => a - b);

                const gradesArray = Object.entries(grades)
                    .sort(([a], [b]) => SORT[a] - SORT[b]);

                return {
                    course,
                    semester,
                    section: sectionModel,
                    instructor: instructorModel,
                    grades: gradesArray,
                    gpa: gpaTotal === 0 ? null : gpaArray
                };
            }));

            await race([Boilergrades.bulkWrite(data.filter(x => x).map(data => ({
                updateOne: {
                    filter: { section: data.section._id, instructor: data.instructor._id },
                    update: { $setOnInsert: {
                        course: data.course._id,
                        semester: data.semester._id,
                        grades: data.grades,
                        gpa: data.gpa
                    }},
                    upsert: true
                }
            }))), abortPromise]);

            log('updated boilergrades for subject', subject);
        }
    }));

    log('updated all boilergrades');
};
