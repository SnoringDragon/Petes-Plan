const cheerio = require('cheerio');
const { XMLParser } = require('fast-xml-parser');
const BaseService = require('./base-service');

// documentation on banner student self service
// https://my.suu.edu/help/article/1423/student-ss-87-user-guide/attachment/

class SelfServiceCourseSummary {
    constructor(course) {
        this.subject = course.CourseSubjectAbbreviation;
        this.number = course.CourseNumber;
        this.shortTitle = course.CourseShortTitle;
        this.longTitle = course.CourseLongTitle;
        this.description = course.CourseDescription // rarely a course does not have a description (ex: EDPS 90100)
            ?.replace(/\s*\bCredit Hours: \d+\.\d+\.\s*/g, '') ?? '';
        this.effectiveDate = course.CourseEffectiveDate; // not sure what this is
        this.creditBasis = course.CourseCreditBasis; // not sure what this is, appears to be "Regular"
        this.minCredits = +course.CourseCreditMinimumValue;
        this.maxCredits = +(course.CourseCreditMaximumValue ?? course.CourseCreditMinimumValue);

        // sanity check on credits values
        if (this.maxCredits < this.minCredits)
            this.maxCredits = this.minCredits;
        if (Number.isNaN(this.maxCredits))
            this.maxCredits = 0;
        if (Number.isNaN(this.minCredits))
            this.minCredits = 0;

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
class BannerSelfService extends BaseService {
    /**
     * Create new Banner Self Service API
     *
     * @param {RequestInit & {baseUrl: string}} options fetch and base url options, see node-fetch documentation for options
     * @param options.baseUrl base URL for self service webpage
     */
    constructor(options = {
        baseUrl: 'https://selfservice.mypurdue.purdue.edu/prod'
    }) {
        super(options);
    }

    /**
     * Get a list of catalog terms by name and internal value
     *
     * @returns {Promise<{
     *     name: string,
     *     value: string
     * }[]>}
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
     * @returns {Promise<{
     *  subjects: { name: string, value: string }[],
     *  colleges: { name: string, value: string }[],
     * }>}
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

        // find option dropdown by id
        const mapOptionsToObject = id => $(`${id} option`)
            .filter((i, option) => $(option).attr('value') !== '%') // remove wildcard option
            .map((i, option) => ({
                name: $(option).text(),
                value: $(option).attr('value')
            })).toArray();

        // find subject dropdown
        const subjects = mapOptionsToObject('#subj_id');

        // find college dropdown
        const colleges = mapOptionsToObject('#coll_id');

        // do we need anything else?
        return { subjects, colleges };
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
    async getCourseList({ term, subjects, colleges,
                            courseNumberStart = 1,
                            courseNumberEnd = 99999 }) {
        const joinMultiOption = value => {
            if (typeof value === 'string')
                return `\t${value}\t`;
            if (Array.isArray(value) && value.length)
                return value.map(v => `\t${v}\t`).join(''); // expects each value to be tab padded and joined
            return '%'; // wildcard token
        };

        const params = new URLSearchParams({
            term_in: term,
            subj_in: joinMultiOption(subjects),
            title_in: '%%',
            divs_in: '%',
            dept_in: '%',
            coll_in: joinMultiOption(colleges),
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

    /**
     * Get prerequisites for courses given term and subject
     * @param term
     * @param subject
     * @typedef {import('../utils/requisites-parser.mjs').Group
     *  | import('../utils/requisites-parser.mjs').Course
     *  | import('../utils/requisites-parser.mjs').NonCourse
     *  | import('../utils/requisites-parser.mjs').StudentAttribute
     *  | null} Requisite
     * @returns {Promise<{failed: {courseNumber: string, subject: string, name: string, error: Error }[],
     *  requisites: {courseNumber: string, subject: string, name: string, requisites: Requisite}[]}>}
     */
    async getPrerequisites({ term, subject }) {
        const response = await this._fetch('bzwkpreq.p_display_prereqs', {
            method: 'POST',
            body: `term_in=${term}&sel_subj=None_Selected&sel_subj=${subject}`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });

        const $ = cheerio.load(await response.text());

        // this page is formatted as repeating <b> and <blockquote> tags
        const courseTitles = $('.pagebodydiv > b');
        const courseBodies = $('.pagebodydiv > blockquote');

        if (courseTitles.length !== courseBodies.length)
            throw new Error(`unexpected response from server`);

        const parser = new (await import('../utils/requisites-parser.mjs')).RequisitesParser();

        const failed = [];
        const results = courseTitles.map((i, title) => {
            let requisites = null;
            const [subject, courseNumber, name] = $(title).text().match(/^(\w+)\s+(\w+)\s+(.+)/).slice(1);
            try {
                requisites = parser.parse($(courseBodies[i]).text());
            } catch (error) {
                failed.push({
                    subject, courseNumber, name, error
                });
            }
            return {
                subject, name, courseNumber,
                requisites
            }
        }).toArray();

        return { failed, requisites: results };
    }

    async getRestrictions({ term, subject }) {
        const response = await this._fetch('bzwkschd.p_display_restrictions', {
            method: 'POST',
            body: `term_in=${term}&sel_subj=None_Selected&sel_subj=${subject}`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });

        const $ = cheerio.load(await response.text());

        // this page is formatted as repeating <b> and <blockquote> tags
        const courseTitles = $('.pagebodydiv > b');
        const courseBodies = $('.pagebodydiv > blockquote');

        if (courseTitles.length !== courseBodies.length)
            throw new Error(`unexpected response from server`);

        const restrictionRegex = new RegExp(
            // match beginning of section text, with wildcard to account for various different texts
            String.raw`^(Must|May not) be[ -~]+the following ` +
            // capture the type of restriction (doesn't have a colon), followed by a colon and optional non-linebreak whitespace
            String.raw`([^:]+):[^\S\r\n]*` +
            // list of restrictions, repeat of either empty line or some text that has spaces before it
            String.raw`((?:[^\S\r\n]*\r?\n|[^\S\r\n]+[ -~]+)+)`
        , 'gm');

        return courseTitles.map((i, title) => {
            const [, subject, courseNumber, name, crn] = $(title).text().trim()
                .match(/^(\w+)\s+(\w+)\s+(.+?)\s+-\s+CRN\s(\d+)$/);

            restrictionRegex.lastIndex = 0; // reset regex last match

            const restrictionsText = $(courseBodies[i]).text().trim();

            const restrictions = {};

            for (let [, restrictionHeader, type, restrictionBody] of restrictionsText.matchAll(restrictionRegex)) {
                const restrictionList = new Set(restrictionBody.split(/\r?\n/g)
                    .map(str => str.trim())
                    .filter(x => x));
                type = type.toLowerCase();
                const isBlocklist = restrictionHeader === 'May not';

                if (type.startsWith('fields of study')) type = 'fieldsOfStudy';
                if (type === 'student attributes') type = 'studentAttributes';

                /*
                list of possible types. each type contains a set of values

                majors: self-explanatory
                minors: self-explanatory (not frequently used)
                concentrations: self-explanatory (not frequently used)
                fieldsOfStudy: major, minor, or concentrations
                classifications: student classification
                    for undergraduates: format is "{class}: {hour range}" (e.g. "Freshman: 0 - 14 hours")
                    for graduates: is "Graduate"
                    for professional students: "Professional {year} Year" (e.g. "Professional First Year") (not sure if year is credit based)
                levels: "Undergraduate", "Graduate", or "Professional"
                colleges: both colleges and schools appear to be in this section
                programs: degree or certificate program. usually in form of "{program name}-{program type}" (e.g. "Computer Science-BS"), but not always
                studentAttributes: not sure what this is used for, appears to only contain 3 possible values:
                    "Professional Masters", "Prof Masters Programs", or "PWL Instance"
                campuses: have seen values "West Lafayette Continuing Ed", "Lafayette", and "Vincennes"
                    can probably ignore any value that isn't "West Lafayette Continuing Ed"
                degrees: degree type (e.g. "Bachelor of Arts", "Doctor of Pharmacy", etc.)
                cohorts: various collections, examples include "Honors College", "Data Mine Corporate Partners",
                    "Purdue Promise", "Engineering Goss Scholars"
                 */

                restrictions[type] = {
                    isBlocklist,
                    values: new Set(restrictionList)
                };
            }

            return { subject, courseNumber, name, crn, restrictions };
        }).toArray();
    }
}

module.exports = new BannerSelfService();
module.exports.BannerSelfService = BannerSelfService;
