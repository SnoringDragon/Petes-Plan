const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function(globalConfig, projectConfig) {
    const mongod = await MongoMemoryServer.create({
        instance: {
            port: 11223
        }
    });
    globalThis.__MONGOD__ = mongod;
};
