const selfService = require('../services/banner-self-service');
const sleep = require('../utils/sleep');

async function fetchIndividualSubject(term, subject, colleges) {
    const [courseList, requisiteResults, restrictions] = await Promise.all([
        selfService.getCourseList({
            term: term.value,
            subjects: [subject.value],
            colleges: colleges.map(c => c.value) // this allows us to filter west lafayette-only courses
        }),
        selfService.getPrerequisites({term: term.value, subject: subject.value}),
        selfService.getRestrictions({term: term.value, subject: subject.value})
    ]);

    console.log(subject.name, courseList);
    // TODO: save to db
}

module.exports = async ({ batchSize = 7, sleepTime = 750 } = {}) => {
    const terms = await selfService.getCatalogTerms();

    for (const term of terms) {
        const options = await selfService.getOptionsForTerm(term.value);

        await Promise.all([...new Array(batchSize)].map(async (_, i) => {
            while (options.subjects.length) {
                const subject = options.subjects.shift(); // get next subject to process
                console.log('fetching term', term.name, 'subject', subject.name);

                await fetchIndividualSubject(term, subject, options.colleges);
                await sleep(sleepTime);
            }
        }));
    }
};