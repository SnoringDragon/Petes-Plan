const BaseService = require('./base-service');
const cheerio = require('cheerio');

class Acalog extends BaseService {
    constructor(options = {
        baseUrl: 'https://catalog.purdue.edu'
    }) {
        super(options);
    }

    async getCatalogTerms() {
        const res = await this._fetch('index.php');

        const $ = cheerio.load(await res.text());

        const options = $('select[name=catalog] option');

        return options.map((i, el) => ({
            id: +el.attribs.value,
            name: $(el).text()
        })).toArray();
    }

    async getPrograms({ catalog, page = 1, search = '' } = {}) {
        const res = await this._fetch('search_advanced.php?' + new URLSearchParams({
            cur_cat_oid: catalog,
            ppage: page,
            search_database: 'Search',
            'filter[keyword]': search,
            'filter[31]': 1,
            'filter[1]': 1,
            sorting_type: 1
        }));

        const $ = cheerio.load(await res.text());

        const table = $('td.block_content > table[class=table_default] > tbody');

        if (table.length !== 1)
            throw new Error('unexpected result from server');

        const rows = $(table).find('tr');

        if (rows.length <= 4)
            throw new Error('unexpected result from server');

        return {
            pageCount: +new URLSearchParams($(rows[rows.length - 2]).find('a')
                .last().attr('href')).get('ppage'),
            programs: rows.map((i, row) => {
                if (i < 2 || i >= rows.length - 2) return;

                const link = $(row).find('a');
                const text = $(link).text().trim();

                return {
                    id: +new URLSearchParams(link.attr('href').split('?')[1])
                        .get('poid'),
                    text
                };
            }).toArray()
        };
    }

    async getDegreeInfo({ catalog, degree }) {
        const res = await this._fetch(`preview_degree_planner.php?catoid=${catalog}&poid=${degree}`);

        const $ = cheerio.load(await res.text());

        let aboutText = '';
        let requiredCredits = 0;
        let supergroups = [];
        let lastSupergroup = null;
        let lastGroup = null;
        let lastRequirements = null;
        let isChooseOne = false;
        let previousCourseOr = false;

        const updateRequirementToGroup = () => {
            if (lastRequirements) {
                if (!lastGroup) lastGroup = { requirements: [] };
                lastGroup.requirements.push(lastRequirements);
                lastRequirements = null;
            }
        };
        const updateGroupToSupergroup = () => {
            if (lastGroup) {
                if (!lastSupergroup) return console.log('warning: no supergroup found for group to belong to');
                lastSupergroup.groups.push(lastGroup);
                lastGroup = null;
            }
        };
        const updateSupergroups = () => {
            if (lastSupergroup) {
                supergroups.push(lastSupergroup);
                lastSupergroup = null;
            }
        };

        const getContents = row => $(row).find('> td > div').text().trim()
            .replace(/[^\S\r\n]+/g, ' ')
            .replace(/(?:[^\S\r\n]*\r?\n[^\S\r\n]*)+/g, '\n')
            .trim() || null;

        const getCredits = text => {
            let credits = 0;

            text = text.replace(/\s*\((\d+)\s*credits?\)\s*/ig, (_, c) => {
                credits = +c;
                return '';
            });

            return [credits, text];
        };

        let end = false;

        $('#acalog-degree-planner-content > tbody > tr').map((i, row) => {
            if (end) return;

            const id = row.attribs.id;

            if (['acalog-degree-planner-logo', 'acalog-degree-planner-info'].includes(id)) return;

            if (id === 'acalog-degree-planner-programs') {
                const about = $(row).find('div > :is(p, div)');

                aboutText = about.map((_, el) => {
                    const text = $(el).text().trim();

                    if (text.endsWith(' Website')) return;
                    if (text.includes('(CODO) Requirements')) return;

                    return text.replace(/\s+/g, ' ').trim();
                }).toArray().join('\n').trim();

                return;
            }

            let headerType = null;
            let headerText = '';

            const header = $(row).find('td > :is(h1, h2, h3, h4, h5, h6)')[0];
            if (header) {
                headerType = header.name;
                headerText = $(header).text();
            }

            if (headerType === 'h2' && ['Requirements', 'Degree Requirements'].includes(headerText)) {
                const text = $(row).find('div h3').text();
                const credits = text.match(/(\d+) Credits Required/)?.[1];
                if (credits) requiredCredits = +credits;
                return;
            }

            if (headerType === 'h2') {
                let credits;
                [credits, headerText] = getCredits(headerText);

                updateRequirementToGroup();
                updateGroupToSupergroup();
                updateSupergroups();

                lastSupergroup = {
                    text: headerText,
                    credits,
                    groups: [],
                    description: getContents(row),
                    isChooseOne: /choose\s*one/i.test(headerText)
                };

                isChooseOne = false;
                previousCourseOr = false;

                return;
            }

            if (headerType === 'h3') {
                if (headerText === 'Prerequisite Information:') {
                    end = true;
                    return;
                }

                let credits;
                [credits, headerText] = getCredits(headerText);

                updateRequirementToGroup();
                updateGroupToSupergroup();

                lastGroup = {
                    text: headerText,
                    credits,
                    requirements: [],
                    description: getContents(row)
                };

                isChooseOne = /choose\s*one/i.test(headerText);
                previousCourseOr = false;

                return;
            }

            const cell = $(row).find('> td').first();
            const cellClass = cell.attr('class') ?? '';
            const text = cell.text().trim()
                .replace(/[^\S\r\n]+/g, ' ')
                .replace(/(?:[^\S\r\n]*\r?\n[^\S\r\n]*)+/g, '\n');

            if (cellClass.includes('course')) {
                const [, subject, courseID] = text.match(/([A-Z]+) ([A-Z\d]+)/) ?? [];

                if ((isChooseOne || previousCourseOr) && lastRequirements?.type === 'course') {
                    lastRequirements.courses.push({ subject, courseID });
                } else {
                    updateRequirementToGroup();
                    lastRequirements = {
                        type: 'course',
                        courses: [{ subject, courseID }]
                    };
                }

                previousCourseOr = /\sor$/i.test(text);

                return;
            }

            if (cellClass.includes('ad-hoc')) {
                if (/choose\s*one/i.test(text)) {
                    isChooseOne = true;
                } else if (!/^(?:requirements|required):?$/i.test(text) && text) {
                    isChooseOne = false;
                    updateRequirementToGroup();
                    lastRequirements = {
                        type: 'non_course',
                        text
                    };
                }
            }
        });

        updateRequirementToGroup();
        updateGroupToSupergroup();
        updateSupergroups();

        return { about: aboutText, requiredCredits, supergroups };
    }
}


module.exports = new Acalog();
module.exports.Acalog = Acalog;
