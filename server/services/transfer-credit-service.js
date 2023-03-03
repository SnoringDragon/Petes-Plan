const cheerio = require('cheerio');
const BaseService = require('./base-service');

class TransferCreditService extends BaseService {
    constructor(options = { baseUrl: 'https://www.admissions.purdue.edu/transfercredit' }) {
        super(options);
    }

    /**
     * Get AP credits
     * @returns {Promise<{
     *     name: string,
     *     scores: {
     *         score: number,
     *         courses: { courseID: string, subject: string }[]
     *     }[]
     * }[]>}
     */
    async getAPCredits() {
        const response = await this._fetch('collegeboardap.php');
        const $ = cheerio.load(await response.text());

        return $('.accordion > .accordion__heading').toArray().map(heading => {
            const content = $($(heading).data('target'));

            const rows = $(content).find('tr');

            // first row is header, second is scores, third is corresponding courses
            if (rows.length !== 3)
                throw new Error('unexpected result from server');

            const score = $(rows[1]).find('td');
            let courses = $(rows[2]).find('td');

            // some cells are separated by non-breaking spaces (u+00a0)
            if (courses.length === 1)
               courses = courses.text().split(/(?:\u00a0 ?)+/g);
            else
                courses = courses.map((_, c) => $(c).text()).toArray();

            if (score.length !== courses.length)
                throw new Error('unexpected result from server');

            return {
                name: $(heading).text().trim()
                    .replace(/\s+/g, ' ') // remove duplicate spaces
                    .replace(/^AP\b/g, '') // remove AP at beginning
                    .trim(),
                credits: score.toArray().map((scoreCell, i) => {
                    const scoreText = $(scoreCell).text();
                    const courseText = courses[i];

                    const subject = courseText.match(/^[A-Z&]+\b/)?.[0];
                    const courseNumbers = courseText.match(/\b[0-9X]+\b/g);

                    if (isNaN(scoreText) || !subject)
                        throw new Error('unexpected result from server');

                    return {
                        score: +scoreText,
                        courses: courseNumbers.map(num => ({
                            courseID: num,
                            subject
                        }))
                    };
                })
            };
        });
    }
}

module.exports = new TransferCreditService();
module.exports.TransferCreditService = TransferCreditService;
