jest.mock('./secret', () => {
    return Buffer.from('testkey');
});

const mongoose = require('mongoose');
const models = require('./models');

const request = require('supertest');

globalThis.request = request;
globalThis.getApp = () => {
    return require('./app')();
};

beforeAll(async () => {
    process.env.ADMIN_EMAIL = 'admin@purdue.edu';
    await models('mongodb://127.0.0.1:11223/');
});

beforeEach(async () => {
    process.env.ADMIN_EMAIL = 'admin@purdue.edu';
});

afterAll(async () => {
    await mongoose.connection.close();
});
