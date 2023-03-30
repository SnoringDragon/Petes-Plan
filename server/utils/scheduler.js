const timeUntil = time => {
    const err = new TypeError(`unknown time specification "${time}"`);

    if (typeof time !== "string") throw err;
    const parts = time.match(/^\s*(\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?\s*([ap]m)?\s*$/i);

    if (parts === null) throw err;

    // parse time parts from string
    let hours = +parts[1];
    const minutes = +(parts[2] ?? 0);
    const seconds = +(parts[3] ?? 0);

    // convert to 24 hr time
    if (parts[4]?.toLowerCase() === 'pm')
        hours += 12;

    // invalid time
    if (hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59 ||
        seconds < 0 || seconds > 59)
        throw err;

    const future = new Date();
    future.setHours(hours, minutes, seconds, 0);

    const msInDay = 24 * 60 * 60 * 1000;
    const wait = ((+future + msInDay) - Date.now()) % msInDay;

    return wait === 0 ? wait + msInDay : wait;
};

const scheduleRepeat = (func, time, ...args) => {
    let lastTimeout;
    const repeat = () => {
        const wait = timeUntil(time);
        lastTimeout = setTimeout(() => {
            try {
                func(...args);
            } catch (e) {
                console.error(e);
            }
            setTimeout(repeat, 1000);
        }, wait);
    };
    return { cancel: () => clearTimeout(lastTimeout) };
};

module.exports.scheduleRepeat = scheduleRepeat;
module.exports.timeUntil = timeUntil;

