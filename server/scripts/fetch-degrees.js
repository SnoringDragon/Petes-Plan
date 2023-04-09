const acalog = require('../services/acalog');
const race = require('race-as-promised');

module.exports = async ({ batchSize = 16, abort = new AbortController(),
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

    await Promise.all([...new Array(batchSize)].map(async () => {
        while (!abort.signal.aborted) {
            const program = await getNextProgram();
            if (!program) return;

            if (program.text.includes('(CODO) Requirements') ||
                program.text.includes('Supplemental Information')) continue;

            let info;
            try {
                info = await race([acalog.getDegreeInfo({ catalog, degree: program.id })]);
            } catch (e) {
                error('failed to fetch degree info:', e);
            }

            if (!info.supergroups.length)
                continue;

            console.log(info);
        }
    }));
}
