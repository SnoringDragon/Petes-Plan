const rateMyProfessor = require('../services/ratemyprofessor');
const Instructor = require('../models/instructorModel');
const Semester = require('../models/semesterModel');
const { nicknames, similarNames } = require('../utils/names');
const { parseFullName } = require('parse-full-name');

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

    // maybe it's a nickname?
    for (const db of [nicknames, similarNames]) {
        if (firstname.toLowerCase() in db && !isNickname) {
            for (const nick of db[firstname.toLowerCase()]) {
                const res = await queryInstructor(nick, lastname, true);

                if (res) return res;
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

    // may be missing some punctuation
    const firstPunctuationRegex = new RegExp('\\b' + firstname.split('').join('\\W?') + '\\b', 'i');
    const lastPunctuationRegex = new RegExp('\\b' + lastname.split('').join('\\W?') + '\\b', 'i')
    result = await Instructor.find({
        firstname: firstPunctuationRegex,
        lastname: lastPunctuationRegex
    });

    if (result.length === 1)
        return result[0];

    // too many, try narrowing
    const punctuationConditions = [
        instructor => firstRegex.test(instructor.firstname),
        instructor => lastRegex.test(instructor.lastname),
        instructor => instructor.firstname === firstname,
        instructor => instructor.lastname === lastname
    ];

    for (const condition of punctuationConditions) {
        const filtered = result.filter(condition)
        if (filtered.length === 1)
            return filtered[0];
    }

    return null;
}


const findInstructor = async ({ firstName, lastName, ratings, id }, earliestYear) => {
    if (!ratings.edges.length) return false; // dont bother finding instructors with no ratings
    let instructor = null;

    instructor = await Instructor.findOne({
        rateMyProfIds: id
    });

    if (instructor) return instructor;

    const names = parseFullName(`${firstName} ${lastName}`);

    const latestReviewYear = Math.max(...ratings.edges
        .map(({ node }) => new Date(node.date).getFullYear()));

    instructor = await queryInstructor(names.first, names.last);

    if (names.nick && !instructor)
        instructor = await queryInstructor(names.nick, names.last);

    if (!instructor) {
        // this instructor may not work at purdue anymore, dont warn if reviews are too old
        if (latestReviewYear > earliestYear) {
        } else {
            return false;
        }
    }

    return instructor;
};

module.exports = async () => {
    // const ratings = await rateMyProfessor.getRatings();

    const ratings = require('../ratemyprof.json');

    const semesters = await Semester.find();
    const earliestYear = Math.min(...semesters.map(s => s.year));

    console.log('finding instructors:', ratings.search.teachers.edges.length)
    const start = Date.now();

    const result = await Promise.all(ratings.search.teachers.edges.map(async ({ node }) => {
        const result = await findInstructor(node, earliestYear);

        return [node, result];
    }))

    let i = 0;
    result.forEach(([node, res]) => {
        // if (res)
        //     console.log(node.firstName, node.lastName, '=>', res.firstname, res.lastname)
        if (res === null)
            console.log('instructor not found for', node.firstName, node.lastName, ++i);
    })

    // const res = await Instructor.aggregate([{
    //     $facet: {
    //         q1: [{ $match: { firstname: new RegExp('will', 'i'), lastname: new RegExp('crum', 'i') } }]
    //     }
    // }]).hint({ firstname: 1, lastname: 1 });
    // const res = await Instructor.aggregate([{
    //     $facet: query
    // }]).hint({ firstname: 1, lastname: 1 });
    console.log(Date.now() - start)

};
