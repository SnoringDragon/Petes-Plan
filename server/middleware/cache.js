const redisClient = require('../utils/redisClient');

const cacheMiddleware = (ttl = 3600) => {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl}`;
        console.log(`Checking cache for: ${key}`); // LOG 1

        try {
            const cachedResponse = await redisClient.get(key);
            if (cachedResponse) {
                console.log(`CACHE HIT: ${key}`); // LOG 2
                return res.json(JSON.parse(cachedResponse));
            }
            
            console.log(`CACHE MISS: ${key}. Fetching from DB...`); // LOG 3
            
            const originalJson = res.json.bind(res);
            res.json = async (body) => {
                console.log(`Saving to cache: ${key}, body:`, body); // add this
                await redisClient.setEx(key, ttl, JSON.stringify(body));
                return originalJson(body);
            };
            
            next();
        } catch (err) {
            console.error("Redis Error in Middleware:", err);
            next();
        }
    };
};

module.exports = cacheMiddleware;