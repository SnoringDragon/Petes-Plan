const acalog = require('../services/acalog');
const race = require('race-as-promised');
const sleep = require('../utils/sleep');
const Degree = require('../models/degreeModel');

// https://www.purdue.edu/registrar/curriculum/Active_Curriculum.html
const DEGREE_CODES = [
    'BSAAE',
    'BS',
    'BA',
    'ND',
    'BSCH',
    'BSBE',
    'BSBME',
    'DS',
    'BSCHE',
    'BSCE',
    'BSCMPE',
    'BSCNE',
    'DPHAR',
    'BSEE',
    'BSEEE',
    'BSAGE',
    'BSFOR',
    'BFA',
    'BSIE',
    'BSLA',
    'BSME',
    'BSMSE',
    'BSE',
    'BSN',
    'BSNE',
    'AAS',
    'BSVN',
    'DVM',
    'MSAAE',
    'ND',
    'PHD',
    'MSAAM',
    'MS',
    'MSABE',
    'MSE',
    'MAGR',
    'MA',
    'MSBME',
    'MSCE',
    'MSCHE',
    'MSCMT',
    'MFA',
    'MSECE',
    'MAT',
    'EDS',
    'MSED',
    'MSEEE',
    'MSENE',
    'MSFOR',
    'MSAT',
    'MSIE',
    'MSME',
    'MBA',
    'MSIA',
    'MSMSE',
    'MNE',
    'MSNE',
    'DNP',
    'MHA',
    'MPH',
    'DAUD',
    'DTECH',
];

const DEGREE_REGEX = DEGREE_CODES.map(code => new RegExp(`,\\s*${code}`));

module.exports = async ({ batchSize = 16, sleepTime = 250, abort = new AbortController(),
                            log = console.log,
                            error = console.error } = {}) => {
    let listener;
    const abortPromise = new Promise((_, reject) => abort.signal.addEventListener('abort', listener = reject));

    const terms = await race([acalog.getCatalogTerms(), abortPromise]);

    const catalog = terms[0].id;

    const programs = [];
    let pages = Infinity;
    let page = 1;
    let programPromise = null;
    let backgroundPromise = null;

    const getNewPage = async () => {
        log('fetching page', page, 'of programs');
        try {
            const data = await race([acalog.getPrograms({catalog, page}), abortPromise]);
            page += 1;
            if (pages === Infinity) pages = data.pageCount;
            programs.push(...data.programs);
            return data;
        } catch (e) {
            error('failed to fetch new page of programs:', e);
            throw e;
        }
    };

    const getProgramsInBackground = () => {
        if (programs.length >= 2 * batchSize) return;
        if (backgroundPromise) return;
        if (page > pages) return;

        return backgroundPromise = getNewPage()
            .then(() => {
                backgroundPromise = null;
                getProgramsInBackground();
            })
            .finally(() => backgroundPromise = null);
    };

    const getNextProgram = async () => {
        if (programPromise) await race([programPromise, abortPromise]);

        if (!programs.length && page <= pages) {
            if (backgroundPromise) {
                await race([backgroundPromise, abortPromise]);
            } else {
                programPromise = getNewPage()
                    .finally(() => programPromise = null);
            }

            return getNextProgram();
        }

        getProgramsInBackground();

        return programs.shift();
    };

    const degrees = new Map();

    await Promise.all([...new Array(batchSize)].map(async () => {
        while (!abort.signal.aborted) {
            await race([sleep(sleepTime), abortPromise]);
            const program = await getNextProgram();
            if (!program) return;

            if (program.text.includes('(CODO) Requirements') ||
                program.text.includes('Supplemental Information')) continue;

            let type = null;
            if (/\bcertificate\b/i.test(program.text))
                type = 'certificate';
            else if (/\bminor\b/i.test(program.text))
                type = 'minor';
            else if (/\bconcentration\b/i.test(program.text))
                type = 'concentration';
            else if (DEGREE_REGEX.some(r => r.test(program.text)))
                type = 'major';
            else continue;

            let info;
            try {
                log('fetching info for program', program.text);
                info = await race([acalog.getDegreeInfo({ catalog, degree: program.id })]);
            } catch (e) {
                error('failed to fetch degree info for', program.text, e);
                continue;
            }

            if (!info.groups.length) continue;

            degrees.set(program.id, {
                name: program.text,
                type,
                info: info.about,
                link: `https://catalog.purdue.edu/preview_program.php?catoid=${catalog}&poid=${program.id}`,
                requirements: info.groups,
                requiredCredits: info.requiredCredits,
                otherProgramLinks: info.links
            });
        }
    }));

    log('removing old degrees...');
    await race([Degree.deleteMany({
        name: { $nin: [...degrees.values()].map(d => d.name) }
    }), abortPromise]);

    const concentrationMap = new Map();
    const concentrations = [...degrees.values()].filter(deg => deg.type === 'concentration');

    log('updating concentrations...');
    await race([Degree.bulkWrite(concentrations.map(deg => ({
        updateOne: {
            filter: { name: deg.name },
            update: { $set: {
                type: deg.type,
                info: deg.info,
                link: deg.link,
                requirements: deg.requirements,
                requiredCredits: deg.requiredCredits,
                concentrations: []
            }},
            upsert: true
        }
    }))), abortPromise]);

    const concentrationModels = await race([Degree.find({ name: {
        $in: concentrations.map(deg => deg.name)
    } }), abortPromise]);

    concentrationModels.forEach(c => {
        concentrationMap.set(c.name, c._id);
    });

    log('updating degrees...');
    await race([Degree.bulkWrite([...degrees.values()].filter(deg => deg.type !== 'concentration').map(deg => {
        const concentrations = deg.otherProgramLinks.map(id => {
            const name = degrees.get(id)?.name;
            if (!name) return;
            return concentrationMap.get(name);
        }).filter(x => x);

        return {
            updateOne: {
                filter: { name: deg.name },
                update: { $set: {
                    type: deg.type,
                    info: deg.info,
                    link: deg.link,
                    requirements: deg.requirements,
                    requiredCredits: deg.requiredCredits,
                    concentrations
                }},
                upsert: true
            }
        };
    })), abortPromise]);

    log('updated degrees');
}
