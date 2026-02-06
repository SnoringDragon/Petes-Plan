module.exports.makePromiseCache = func => {
    const cache = new Map();

    return (...args) => {
        const key = JSON.stringify(args);
        const promise = cache.get(key);

        if (promise)
            return promise;

        const result = func(...args)
            .finally(() => cache.delete(key));

        cache.set(key, result);

        return result;
    };
};
