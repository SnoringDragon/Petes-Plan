const BaseService = require('./base-service');
const cheerio = require('cheerio');
const { NodeHtmlMarkdown } = require('node-html-markdown');
const { defaultTranslators } = require('node-html-markdown/dist/config');

const nhm = new NodeHtmlMarkdown({}, {
    a: (args) => {
        const result = defaultTranslators.a(args);
        if (result.postfix && !result.postfix.slice(2).startsWith('http'))
            result.postfix = `](${new URL(result.postfix.slice(2, -1), 'https://catalog.purdue.edu/').href})`
        return result;
    },
    img: (args) => {
        const result = defaultTranslators.img(args);
        if (result.content) {
            result.content = result.content.replace(/\((.+?)\)$/g, (_, url) => {
                if (!url.startsWith('http'))
                    return '(' + new URL(url, 'https://catalog.purdue.edu/').href + ')';
                return '(' + url + ')';
            })
        }
        return result;
    }
});

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
        const res = await this._fetch(`preview_program.php?catoid=${catalog}&poid=${degree}`);

        const $ = cheerio.load(await res.text());

        let requiredCredits = 0;
        let links = [];

        const getContents = row => {
            const contents = $(row).find('> :not(:is(h1, h2, h3, h4, h5, h6))');
            return nhm.translate(contents.map((i, el) => {
                if (i === contents.length - 1 && el.name === 'ul') return;
                return $.html(el);
            }).toArray().join('')) || null;
        };

        const getCredits = text => {
            let credits = null;

            text = text.replace(/\s*\((\d+)(?:\s*-\s*\d+)?\s*credits?\)\s*/ig, (_, c) => {
                credits = +c;
                return '';
            });

            if (credits === null) text = text.replace(/(?:\s*-\s*)?credit\s*hours:?\s*(\d+(?:\.\d+)?)\s*/ig, (_, c) => {
                credits = +c;
                return '';
            });

            return [credits ?? 0, text];
        };

        let end = false;

        const contents = $('.block_content_outer .block_content > table > tbody > tr');

        const about = nhm.translate(contents.first().find('.program_description').html());

        const parseCourseList = row => {
            const rows = $(row).find('> *').last()[0];

            if (rows.name !== 'ul') return [];

            const courses = [];
            let previousGroup = null;

            const addGroup = group => {
                if (previousGroup) courses.push(previousGroup);
                previousGroup = group;
            };

            $(rows).find('> li').map((_, cell) => {
                const cellClass = $(cell).attr('class') ?? '';
                let text = $(cell).text().trim()
                    .replace(/[^\S\r\n]+/g, ' ')
                    .replace(/(?:[^\S\r\n]*\r?\n[^\S\r\n]*)+/g, '\n');

                if (cellClass.includes('course')) {
                    const [, subject, courseID] = text.match(/([A-Z]+) ([A-Z\d]+)/) ?? [];

                    if (/\sor$/i.test(text) && previousGroup?.type !== 'or')
                        addGroup({
                            type: 'or',
                            groups: []
                        });

                    (previousGroup ? previousGroup.groups : courses)
                        .push({
                            type: 'course',
                            subject,
                            courseID
                        });

                    if (!/\sor$/i.test(text) && previousGroup?.type === 'or')
                        addGroup(null);
                } else if (cellClass.includes('acalog-adhoc-before')) {
                    let credits;
                    [credits, text] = getCredits(text);
                    addGroup({
                        type: 'group',
                        text: text,
                        credits,
                        groups: [],
                        description: null
                    });
                } else if (/choose\s*one/i.test(text)) {
                    addGroup({
                        type: 'or',
                        text: null,
                        groups: [],
                        description: null
                    });
                } else if (!/^(?:requirements|required):?$/i.test(text) && text) {
                    const link = $(cell).find('a').first().attr('href') ?? '';

                    if (link.startsWith('preview_program.php')) {
                        const linkId = +new URLSearchParams(link.split('?')[1]).get('poid');
                        if (!Number.isNaN(linkId)) links.push(linkId);
                    }

                    const [, subject, courseStart, courseEnd] = text.match(/([A-Z]+) ([A-Z\d]+)-([A-Z\d]+)/) ?? [];

                    const req = subject ? {
                        type: 'course_range',
                        courseStart: +courseStart,
                        courseEnd: +courseEnd,
                        subject
                    } : {
                        type: 'non_course',
                        text: nhm.translate($(cell).html())
                    };

                    (previousGroup ? previousGroup.groups : courses).push(req);
                }
            });

            return courses;
        }

        const parseGroups = element => {
            const groups = [];

            element.map((i, row) => {
                if (end) return;

                let headerText = $(row).find('> :is(h1, h2, h3, h4, h5, h6)')
                    .first().text().replace(/\s+/g, ' ').trim();

                if (['Requirements', 'Degree Requirements'].includes(headerText) && !requiredCredits) {
                    const text = $(row).find('h3').text();
                    const credits = text.match(/(\d+) Credits Required/)?.[1];
                    if (credits) {
                        requiredCredits = +credits;
                        return;
                    }
                }

                const rowClass = $(row).attr('class');

                if (rowClass.includes('acalog-core')) {
                    if (headerText.includes('Program Requirements')) {
                        end = true;
                        return;
                    }

                    let credits;
                    [credits, headerText] = getCredits(headerText);

                    groups.push({
                        type: 'group',
                        text: headerText,
                        credits,
                        groups: parseCourseList(row),
                        description: getContents(row)
                    });
                } else {
                    const result = parseGroups($(row).find('> div'));
                    if (groups.length)
                        groups[groups.length - 1].groups.push(...result);
                    else
                        groups.push(...result);
                }
            });

            return groups;
        };

        const groups = parseGroups(contents.last().find('> td > div > div'));

        return { about, requiredCredits, groups, links };
    }
}


module.exports = new Acalog();
module.exports.Acalog = Acalog;
