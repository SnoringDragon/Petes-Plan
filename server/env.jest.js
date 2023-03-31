const mongoose = require('mongoose');

const request = require('supertest');

globalThis.request = request;
globalThis.getApp = () => {
    return require('./app')();
};

beforeAll(async () => {
    await require('./models')('mongodb://127.0.0.1:11223/');
});

beforeEach(async () => {
    process.env.JWT_SECRET_KEY = 'testkey';
    process.env.ADMIN_EMAIL = 'admin@purdue.edu';
});

afterAll(async () => {
    await mongoose.connection.close();
});
