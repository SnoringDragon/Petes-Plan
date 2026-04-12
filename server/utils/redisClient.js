const { createClient } = require('redis');

const CACHE_ENABLED = process.env.CACHE_ENABLED === 'true';

let client = null;

if (CACHE_ENABLED) {
    client = createClient({ 
        url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    });

    client.on('error', (err) => console.error('Redis Client Error', err));
    client.on('connect', () => console.log('Connected to Redis successfully'));

    (async () => {
        await client.connect();
    })();
} else {
    console.log('Cache disabled — CACHE_ENABLED=false');
}

module.exports = client;