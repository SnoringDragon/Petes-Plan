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

        $('#acalog-degree-planner-content > tbody > tr').map((i, row) => {
            const id = row.attribs.id;

            if (['acalog-degree-planner-logo', 'acalog-degree-planner-info'].includes(id)) return;

            if (id === 'acalog-degree-planner-programs') {
                const about = $(row).find('div > p');

                aboutText = about.map((_, el) => {
                    const text = $(el).text().trim();

                    if (text.endsWith(' Website')) return;
                    if (text.includes('(CODO) Requirements')) return;

                    return text.replace(/\s+/g, ' ').trim();
                }).toArray().join('\n');

                return;
            }

            let headerType = null;
            let headerText = '';

            const header = $(row).find('td > :is(h1, h2, h3, h4, h5, h6)')[0];
            if (header) {
                headerType = header.name;
                headerText = $(header).text();
            }

            console.log(headerType, headerText)
        });

        return { about: aboutText };
    }
}


module.exports = new Acalog();
module.exports.Acalog = Acalog;
