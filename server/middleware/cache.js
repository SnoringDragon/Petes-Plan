const redisClient = require('../utils/redisClient');

const cacheMiddleware = (ttl = 3600) => {
    return async (req, res, next) => {
        // If cache disabled, skip entirely
        if (!redisClient) return next();

        const key = `cache:${req.originalUrl}`;
        console.log(`Checking cache for: ${key}`);

        try {
            const cachedResponse = await redisClient.get(key);
            if (cachedResponse) {
                console.log(`CACHE HIT: ${key}`);
                return res.json(JSON.parse(cachedResponse));
            }

            console.log(`CACHE MISS: ${key}`);

            const originalJson = res.json.bind(res);
            res.json = async (body) => {
                await redisClient.setEx(key, ttl, JSON.stringify(body));
                return originalJson(body);
            };

            next();
        } catch (err) {
            console.error('Redis Error in Middleware:', err);
            next();
        }
    };
};

module.exports = cacheMiddleware;