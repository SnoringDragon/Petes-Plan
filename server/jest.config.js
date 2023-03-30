module.exports = {
    testTimeout: 30000,
    globalSetup: './setup.jest.js',
    globalTeardown: './teardown.jest.js',
    setupFilesAfterEnv : ['./env.jest.js'],
};