export function makePromiseCache<T, S, A extends Array<S>>(func: (...args: A) => Promise<T>) {
    const cache = new Map<string, Promise<T>>();

    return (...args: A): Promise<T> => {
        const key = JSON.stringify(args);
        const promise = cache.get(key);

        if (promise)
            return promise;

        const result = func(...args)
            .finally(() => cache.delete(key));

        cache.set(key, result);

        return result;
    };
}
