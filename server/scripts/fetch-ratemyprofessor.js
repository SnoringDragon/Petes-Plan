const rateMyProfessor = require('../services/ratemyprofessor');
const purdueDirectory = require('../services/purdue-directory');

const Instructor = require('../models/instructorModel');
const Semester = require('../models/semesterModel');

const sleep = require('../utils/sleep');
const { nicknames, similarNames } = require('../utils/names');
const { parseFullName } = require('parse-full-name');
const ratings = require("../ratemyprof.json");


const toTitleCase = src => {
    return src.replace(/\w\S*/g, t => t[0].toUpperCase() + t.slice(1));
};

const queryInstructor = async (firstname, lastname, isNickname=false) => {
    let result = await Instructor.find({
        firstname: new RegExp('\\b' + firstname.replace(/\W/g, '\\W*') + '\\b', 'i'),
        lastname: new RegExp('\\b' + lastname.replace(/\W/g, '\\W*') + '\\b', 'i')
    });

    if (result.length === 1)
        return result[0];

    // too many found, try to narrow our regular expressions;
    const firstRegex = new RegExp('\\b' + firstname + '\\b', 'i');
    const lastRegex = new RegExp('\\b' + lastname + '\\b', 'i');

    const conditions = [
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

module.exports = async ({ batchSize = 16 } = {}) => {
    console.log('fetching data from ratemyprofessor');

    // const ratings = await rateMyProfessor.getRatings();

    const ratings = require('../ratemyprof.json');

    const semesters = await Semester.find();
    const earliestYear = Math.min(...semesters.map(s => s.year));

    console.log('querying database for instructors')

    const searchInstructorIndices = [];
    const result = await Promise.all(ratings.search.teachers.edges.map(async ({ node }, i) => {
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
                result[index][1] = instructor;
            }
        }
    }));

    const savedIds = new Set();

    await Promise.all(result.map(async ([_, instructor]) => {
        if (instructor && (instructor.isModified() || instructor.$isNew) && !savedIds.has(instructor._id.toString())) {
            await instructor.save();
            savedIds.add(instructor._id.toString());
        }
    }))

    let failedInstructorCount = 0;
    result.filter(([_, res]) => res === null).forEach(([node]) => {
        ++failedInstructorCount;
        console.log('failed to find instructor for', node.firstName, node.lastName);
    })

    console.log('queried', ratings.search.teachers.edges.length, 'instructors, of which',
        failedInstructorCount, 'failed to map');
};
