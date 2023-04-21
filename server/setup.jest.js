const { MongoMemoryServer } = require('mongodb-memory-server');
const {connect} = require("./utils.jest");

module.exports = async function(globalConfig, projectConfig) {
    const mongod = await MongoMemoryServer.create({
        instance: {
            port: 11223
        }
    });
    globalThis.__MONGOD__ = mongod;
    const connection = await connect();
    await connection.db.dropDatabase();
    await connection.close();
};
