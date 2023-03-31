const mongoose = require('mongoose');

const request = require('supertest');
const getApp = require('./app');

const models = require('./models');

globalThis.request = request;
globalThis.getApp = getApp;

beforeAll(async () => {
    process.env.JWT_SECRET_KEY = 'testkey';
    process.env.ADMIN_EMAIL = 'admin@purdue.edu';
    await models('mongodb://127.0.0.1:11223/');
});

afterAll(async () => {
    await mongoose.connection.close();
});
