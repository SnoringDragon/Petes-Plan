const cheerio = require('cheerio');
const BaseService = require('./base-service');

class TooManyResultError extends Error {}

class PurdueDirectory extends BaseService {
    constructor(options = {
        baseUrl: ''
    }) {
        super(options);
    }

    async search({ name, query = name, target = 'staff', searchBy = 'name' }) {
        const targetVal = ['all', 'student', 'staff'].indexOf(target);
        if (targetVal === -1)
            throw new Error(`unknown target ${target}`);
        if (!['name', 'email', 'alias', 'phone'].includes(searchBy))
            throw new Error(`unknown searchBy ${searchBy}`);

        const params = new URLSearchParams({
            SearchString: query,
            SelectedSearchTypeId: targetVal,
            UsingParam: `Search by ${searchBy[0].toUpperCase()}${searchBy.slice(1)}`,
            CampusParam: 'West Lafayette',
            DepartmentParam: 'All Departments',
            SchoolParam: 'All Schools'
        });

        const res = await this._fetch('https://www.purdue.edu/directory/Advanced', {
            method: 'POST',
            body: params.toString(),
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        });

        const $ = cheerio.load(await res.text());


        const errorText = $('#results > p');

        if (errorText.length) {
            const errorTextContents = $(errorText).text();

            if (errorTextContents.includes('your search has returned too many entries'))
                throw new TooManyResultError('too many results for query');

            if (errorTextContents.includes('nothing matches your query'))
                return [];

            throw new Error('unexpected result from server: ' + errorTextContents);
        }

        const results = $('#results > ul > li');

        if (!results.length)
            throw new Error('unexpected result from server');

        return results.map((i, result) => {
            const name = $(result).find('thead th').text().trim();
            const data = { name };

            $(result).find('tbody tr').map((i, row) => {
                const key = $(row).find('th').text()
                    .trim().toLowerCase().replace(/\s+/g, '_');
                const value = $(row).find('td').text().trim();

                data[key] = value;
            });

            return data;
        }).toArray()
    }

    async oldSearch({ name, lastname, target = 'department', email,
               entryType = 'person', searchAlias,
               reportFields = ['alias', 'department', 'email', 'name',
                   'nickname', 'office_phone', 'school', 'title'] } = {}) {
        const query = new URLSearchParams([
            ['searchType', 'Advanced'],
            ['firstname', name ?? ''],
            ['lastname', lastname ?? ''],
            ['SearchTarget', target ?? ''],
            ['email', email ?? ''],
            ['EntryType', entryType ?? 'person'],
            ['searchAlias', searchAlias ?? ''],
            ...reportFields.map(field => ['ReportFields', field])
        ]);

        const res = await this._fetch('https://directory.purdue.edu/directory-bin/X.500-testbrand.pl', {
            method: 'POST',
            body: query.toString(),
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        });

        const $ = cheerio.load(await res.text());

        const table = $('#maincontent > a > table');

        if (table.length === 0)
            throw new TooManyResultError('too many results for query');
        if (table.length !== 1)
            throw new Error('unexpected result from server');

        return $(table).find('tr').map((i, row) => {
            const contents = $(row).find('td pre').contents();
            const data = {};
            let lastKey = null;
            let lastValue = '';

            const addPair = () => {
                if (lastKey && lastValue) {
                    lastValue = lastValue.replace(/^\s*:\s*/g, '').trim();

                    if (lastValue === 'Not present in entry.' || !lastValue)
                        lastValue = null;

                    data[lastKey] = lastValue;
                }
            };

            contents.map((i, content) => {
                if (content.type === 'tag' && content.name === 'b') {
                    addPair();
                    lastKey = $(content).text();
                    lastValue = '';
                } else {
                    lastValue += $(content).text();
                }
            });

            addPair();

            return data;
        }).toArray();
    }
}

module.exports = new PurdueDirectory();
module.exports.PurdueDirectory = PurdueDirectory;
module.exports.TooManyResultError = TooManyResultError;
