const race = require("race-as-promised");
const Instructor = require("../models/instructorModel");
const {nicknames, similarNames} = require("./names");
const toTitleCase = require("./title-case");

const queryInstructor = async (firstname, lastname, isNickname=false, abortPromise) => {
    const lastPunctuationRegex = new RegExp('\\b' + lastname.replace(/\W/g, '\\W*') + '\\b', 'i');
    let result = await race([Instructor.find({
        firstname: new RegExp('\\b' + firstname.replace(/\W/g, '\\W*'), 'i'),
        lastname: lastPunctuationRegex
    }), abortPromise]);

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

        result = await race([Instructor.find({
            firstname: new RegExp(`^\\b${firstInitial}\\w*\\s+${secondInitial}`, 'i'),
            lastname: new RegExp('\\b' + lastname.replace(/\W/g, '\\W*') + '\\b', 'i')
        }), abortPromise]);

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
            const res = await queryInstructor(nick, lastname, true, abortPromise);

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
            const res = await queryInstructor(nick, lastname, true, abortPromise);

            if (res) {
                return res;
            }
        }
    }

    // double barrelled name, try search by each component
    if (lastname.includes('-')) {
        for (const last of lastname.split(/-/g)) {
            const res = await queryInstructor(firstname, last, isNickname, abortPromise);

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
        result = await race([Instructor.find({
            firstname: first,
            lastname: last
        }), abortPromise]);

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
    result = await race([Instructor.find({
        lastname: lastRegex
    }), abortPromise]);
    result = result.filter(instructor => instructor.firstname && firstname &&
        (instructor.firstname.toLowerCase().includes(firstname.toLowerCase()) ||
            firstname.toLowerCase().includes(instructor.firstname.toLowerCase())));

    if (result.length === 1)
        return result[0];

    return null;
}

module.exports = queryInstructor;
