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

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const parseDate = dateString => {
    const result = dateString.toLowerCase().match(/^([a-z]{3}) (\d{1,2}), (\d{4})$/);
    if (!result)
        throw new TypeError(`unknown date string ${dateString}`);

    let [, month, day, year] = result;

    const monthNum = MONTHS.indexOf(month);
    if (monthNum === -1) throw new TypeError(`unknown month ${month}`);
    return `${monthNum + 1}/${day}/${year}`;
};

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

    /**
     * Get terms that are view only
     *
     * @returns {Promise<string[]>}
     */
    async getViewOnlyTerms() {
        const result = await this._fetch('bwckschd.p_disp_dyn_sched');

        const $ = cheerio.load(await result.text());

        return $('select option').map((i, option) => {
            if ($(option).text().includes('View only'))
                return $(option).attr('value');
        }).toArray();
    }

    /**
     * Get a list of proessors by term
     * @param term
     * @returns {Promise<{ first: string, last: string }>}
     */
    async getProfessorsForTerm(term) {
        const result = await this._fetch('bwckgens.p_proc_term_date', {
            method: 'POST',
            body: `p_calling_proc=bwckschd.p_disp_dyn_sched&p_term=${term}`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });

        const $ = cheerio.load(await result.text());
        return $('#instr_id option').map((i, option) => {
            if ($(option).attr('value') !== '%') {
                const [last, first] = $(option).text().split(', ');
                return { first: first.trim(), last: last.trim() };
            }
        }).toArray();
    }

    /**
     * Get a list of course sections for a specified term, subject combo
     * @param term
     * @param subject
     * @returns {Promise<{
     *  sectionName: string,
     *  linkID: string | undefined,
     *  requiredSection: string,
     *  credits: number,
     *  subject: string,
     *  courseID: string,
     *  isHybrid: boolean,
     *  sectionID: string,
     *  crn: number,
     *  scheduledMeetings: {
     *      endDate: string,
     *      startDate: string,
     *      days: ('M' | 'T' | 'W' | 'R' | 'F')[] | null,
     *      startTime: string | null,
     *      endTime: string | null,
     *      location: string,
     *      instructors: null | { name: string, email: string }[]
     *  }[]}[]>}
     */
    async getSections({ term, subject }) {
        const params = new URLSearchParams([
            [ 'term_in', term ],
            [ 'sel_subj', 'dummy' ],
            [ 'sel_day', 'dummy' ],
            [ 'sel_schd', 'dummy' ],
            [ 'sel_insm', 'dummy' ],
            [ 'sel_camp', 'dummy' ],
            [ 'sel_levl', 'dummy' ],
            [ 'sel_sess', 'dummy' ],
            [ 'sel_instr', 'dummy' ],
            [ 'sel_ptrm', 'dummy' ],
            [ 'sel_attr', 'dummy' ],
            [ 'sel_subj', subject ],
            [ 'sel_crse', '' ],
            [ 'sel_title', '' ],
            [ 'sel_schd', '%' ],
            [ 'sel_insm', '%' ],
            [ 'sel_from_cred', '' ],
            [ 'sel_to_cred', '' ],
            [ 'sel_camp', '%' ],
            [ 'sel_ptrm', '%' ],
            [ 'sel_instr', '%' ],
            [ 'sel_sess', '%' ],
            [ 'sel_attr', '%' ],
            [ 'begin_hh', '0' ],
            [ 'begin_mi', '0' ],
            [ 'begin_ap', 'a' ],
            [ 'end_hh', '0' ],
            [ 'end_mi', '0' ],
            [ 'end_ap', 'a' ]
        ]);

        const SCHEDULE_TYPES = {
            Lecture: 'LEC',
            'Lecture 1': 'LEC',
            Recitation: 'REC',
            Presentation: 'PRS',
            'Presentation 1': 'PRS',
            Laboratory: 'LAB',
            'Lab 1': 'LAB',
            'Laboratory Preparation': 'LBP',
            Clinic: 'CLN',
            ...Object.fromEntries([...new Array(9)]
                .map((_, i) => [`Clinic ${i}`, 'CLN'])), // not sure why there are so many clinic types
            Studio: 'SD',
            'Studio 1': 'SD',
            Experiential: 'EX',
            'Experiential 1': 'EX',
            Research: 'RES',
            'Individual Study': 'IND',
            'Individual Study 1': 'IND',
            'Distance Learning': 'DIS',
            'Practice Study Observation': 'PSO',
            'Travel Time': 'PS5',
            'Travel Time 1': 'PS5'
        };

        const result = await this._fetch('bwckschd.p_get_crse_unsec', {
            method: 'POST',
            body: params.toString(),
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });

        const $ = cheerio.load(await result.text());

        const rows = $('.pagebodydiv > .datadisplaytable[summary*=sections] > tbody > tr');

        // formatted as alternating <tr> elements of section name, then section details
        if (rows.length % 2 !== 0)
            throw new Error('unexpected result from server');

        return [...new Array(rows.length / 2)].map((_, i) => {
            const header = rows[i * 2];
            const headerText = $(header).text();
            const content = rows[i * 2 + 1];
            const contentText = $(content).text();
            const timeRows = $(content).find('.datadisplaytable tr');

            // expect at least one class time row
            if (timeRows.length < 2)
                throw new Error('unexpected result from server');

            const linkID = headerText.match(/Link Id: (\w+)/)?.[1];
            const requiredSection = headerText.match(/Linked Sections Required\s*\((\w+)\)/)?.[1];

            const isHybrid = contentText.includes('Hybrid Instructional Method');
            const credits = +(contentText.match(/(\d+\.\d+)/)?.[1] ?? 0);

            const [, sectionName, crn, subject, courseID, sectionID] = $(header)
                .find('a[href*=p_disp_detail_sched]')
                .text()
                .match(/^(.+) - (\d+) - ([A-Z\d]+) ([A-Z\d]+) - (.+)$/);

            let scheduleType = null;

            const scheduledMeetings = timeRows.map((i, row) => {
                if (i === 0) return; // header, skip

                const cells = $(row).find('td');

                // type (always class), time, days, where, date range, schedule type, instructors
                if (cells.length !== 7)
                    throw new Error('unexpected result from server');

                const time = $(cells[1]).text().trim();
                let startTime = null;
                let endTime = null;

                if (!time.includes('TBA'))
                    [startTime, endTime] = time.toUpperCase().split(' - ');

                let days = $(cells[2]).text().trim().split('');
                if (days.length === 0)
                    days = null;

                const location = $(cells[3]).text().trim();

                let [startDate, endDate] = $(cells[4]).text().trim().split(' - ');
                startDate = parseDate(startDate);
                endDate = parseDate(endDate);

                scheduleType = $(cells[5]).text().trim();

                if (!(scheduleType in SCHEDULE_TYPES))
                    throw new Error('unexpected result from server: unknown schedule type ' + scheduleType);

                scheduleType = SCHEDULE_TYPES[scheduleType];

                const instructorContent = $(cells[6]).contents();

                let instructors;

                if (instructorContent.length === 1 && $(cells[6]).text().includes('TBA')) {
                    instructors = null;
                } else {
                    instructors = [];
                    let lastInstructorName = null;

                    instructorContent.map((i, el) => {
                        if (el.type === 'text') {
                            const text = el.data.replace(/[,()]/g, '') // remove separators
                                    .replace(/\s+/g, ' ') // replace extra spaces
                                    .trim();
                            if (!text) return;

                            if (lastInstructorName)
                                instructors.push({
                                    name: lastInstructorName
                                });

                            lastInstructorName = text;
                        } else if (el.name === 'a') {
                            instructors.push({
                                name: lastInstructorName,
                                email: el.attribs.href.replace('mailto:', '')
                            });
                            lastInstructorName = null;
                        }
                    });
                }

                return { startTime, endTime, days, location, startDate, endDate, instructors };
            }).toArray();

            return { crn: +crn, sectionName, linkID, requiredSection,
                subject, courseID, sectionID, isHybrid, credits, scheduledMeetings };
        });
    }
}

module.exports = new BannerSelfService();
module.exports.BannerSelfService = BannerSelfService;
