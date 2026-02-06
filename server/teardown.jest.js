module.exports = async function (globalConfig, projectConfig) {
    await globalThis.__MONGOD__.stop();
};
