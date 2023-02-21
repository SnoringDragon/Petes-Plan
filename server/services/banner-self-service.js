const deepmerge = require('deepmerge');
const cheerio = require('cheerio');
const { XMLParser } = require('fast-xml-parser');

// documentation on banner student self service
// https://my.suu.edu/help/article/1423/student-ss-87-user-guide/attachment/

class SelfServiceCourseSummary {
    constructor(course) {
        this.subject = course.CourseSubjectAbbreviation;
        this.number = course.CourseNumber;
        this.shortTitle = course.CourseShortTitle;
        this.longTitle = course.CourseLongTitle;
        this.description = course.CourseDescription;
        this.effectiveDate = course.CourseEffectiveDate; // not sure what this is
        this.creditBasis = course.CourseCreditBasis; // not sure what this is, appears to be "Regular"
        this.minCredits = course.CourseCreditMinimumValue;
        this.maxCredits = course.CourseCreditMaximumValue ?? course.CourseCreditMinimumValue;
        const attributes = Array.isArray(course.CourseAttribute) ? course.CourseAttribute : [course.CourseAttribute];
        this.attributes = attributes.filter(x => x)
            .map(({ RAPCode, RAPName }) => ({ code: RAPCode, name: RAPName }))

        this.raw = course;
    }

    toJSON() {
        const { raw, ...obj } = this;
        return obj;
    }
}

/**
 * Class for fetching information from Ellucian Banner Student Self Service
 */
class BannerSelfService {
    /**
     * Create new Banner Self Service API
     *
     * @param {RequestInit & {baseUrl: string}} options fetch and base url options, see node-fetch documentation for options
     * @param options.baseUrl base URL for self service webpage
     */
    constructor(options = {
        baseUrl: 'https://selfservice.mypurdue.purdue.edu/prod'
    }) {
        const { baseUrl, ...opts } = options;
        this._options = opts;
        this._baseUrl = baseUrl;
        // dynamic import es module
        this._fetchFunc = import('node-fetch');
    }

    /**
     * Fetch with options
     *
     * @param {string} url
     * @param {RequestInit} opts
     * @returns {Promise<Response>}
     * @private
     */
    async _fetch(url, opts = {}) {
        const response = await (await this._fetchFunc).default(`${this._baseUrl}/${url}`,
            deepmerge(this._options, opts)); // merge default options with override options

        // failed response (4xx, 5xx)
        if (!response.ok) {
            const err = new Error(`HTTP status code ${response.status}`);
            err.response = response;
            err.status = response.status;
            throw err;
        }

        return response;
    }

    /**
     * Get a list of catalog terms by name and internal value
     *
     * @returns {Promise<{
     *     name: string,
     *     value: string
     * }>}
     */
    async getCatalogTerms() {
        const response = await this._fetch('bwckctlg.p_disp_cat_term_date');

        // grab html response
        const $ = cheerio.load(await response.text());
        return $('#term_input_id option')
            // remove "None" fake option
            .filter((i, option) => $(option).attr('value') !== 'None')
            .map((i, option) => ({
                name: $(option).text(),
                value: $(option).attr('value')
            })).toArray();
    }

    /**
     * Get course search options for a course term
     *
     * @param term course term
     * @returns {Promise<{subjects: { name: string, value: string }[]}>}
     */
    async getOptionsForTerm(term) {
        // get course search page
        const response = await this._fetch('bwckctlg.p_disp_cat_term_date', {
            method: 'POST',
            body: new URLSearchParams({
                cat_term_in: term
            }).toString(),
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });

        const $ = cheerio.load(await response.text());
        // find subject dropdown
        const subjects = $('#subj_id option').map((i, option) => ({
            name: $(option).text(),
            value: $(option).attr('value')
        })).toArray();

        // do we need anything else?
        return { subjects };
    }

    /**
     * Get summary for courses
     *
     * @param term course term, see {@link getCatalogTerms}
     * @param single subject or list of subjects, see {@link getOptionsForTerm}
     * @param courseNumberStart start (inclusive) for course number range
     * @param courseNumberEnd end (inclusive) for course number range
     * @returns {Promise<SelfServiceCourseSummary[]>}
     */
    async getCourseList({ term, subjects,
                            courseNumberStart = 1,
                            courseNumberEnd = 99999 }) {
        // convert single subject to 1-array
        subjects = Array.isArray(subjects) ? subjects : [subjects];

        const params = new URLSearchParams({
            term_in: term,
            subj_in: subjects.map(s => `\t${s}\t`).join(''),
            title_in: '%%',
            divs_in: '%',
            dept_in: '%',
            coll_in: '%',
            schd_in: '%',
            levl_in: '%',
            attr_in: '%',
            crse_strt_in: courseNumberStart,
            crse_end_in: courseNumberEnd,
            cred_from_in: '',
            cred_to_in: '',
            last_updated: ''
        });

        // get xml data
        const response = await this._fetch('bwckctlg.xml', {
            method: 'POST',
            body: params.toString(),
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });

        const xml = new XMLParser().parse(await response.text());

        // 200 OK status, but HTML error returned in table
        // likely our query did not produce results
        if (xml.table)
            return [];

        let courseInventory = xml['CrseCat:CourseCatalog'].CourseInventory;
        courseInventory = Array.isArray(courseInventory) ? courseInventory : [courseInventory];

        return courseInventory.map(course => new SelfServiceCourseSummary(course));
    }
}

module.exports = new BannerSelfService();
module.exports.BannerSelfService = BannerSelfService;
