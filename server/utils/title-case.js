module.exports = src => {
    return src.replace(/\w\S*/g, t => t[0].toUpperCase() + t.slice(1));
};
