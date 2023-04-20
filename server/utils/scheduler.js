const parser = require('cron-parser');
const sleep = require('./sleep');

const scheduleRepeat = (func, time, ...args) => {
    let lastTimeout;

    const repeat = () => {
        const nextDate = parser.parseExpression(time).next().toDate();
        let wait = nextDate - new Date();

        return new Promise(async (resolve) => {
            while (wait > 2147483647) {
                const promise = new Promise((resolve) => {
                    lastTimeout = setTimeout(resolve, 2147483647);
                });

                await promise;

                const nextDate = parser.parseExpression(time).next().toDate();
                wait = nextDate - new Date();
            }

            lastTimeout = setTimeout(() => {
                try {
                    func(...args);
                } catch (e) {
                    console.error(e);
                }
                resolve();
                setTimeout(repeat, 1000);
            }, wait);
        });
    };
    repeat();
    return { cancel: () => clearTimeout(lastTimeout) };
};

module.exports.scheduleRepeat = scheduleRepeat;

