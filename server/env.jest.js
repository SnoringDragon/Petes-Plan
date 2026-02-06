jest.mock('./secret', () => {
    return Buffer.from('testkey');
});

const request = require('supertest');
const {connect, disconnect} = require("./utils.jest");
const sleep = require('./utils/sleep');

globalThis.request = request;
globalThis.getApp = () => {
    return require('./app')();
};

beforeAll(async () => {
    process.env.ADMIN_EMAIL = 'admin@purdue.edu';
    await connect();
    await sleep(500);
});

beforeEach(async () => {
    process.env.ADMIN_EMAIL = 'admin@purdue.edu';
    await sleep(500);
});

afterAll(async () => {
    await disconnect();
    await sleep(500);
});
