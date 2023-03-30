const mongoose = require('mongoose');

const models = require('./models');

beforeAll(async () => {
    process.env.JWT_SECRET_KEY = 'testkey';
    await models('mongodb://127.0.0.1:11223/');
});

afterAll(async () => {
    await mongoose.connection.close();
});
