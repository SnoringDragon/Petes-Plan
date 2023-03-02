const mongoose = require('mongoose');

const APTest = require('../models/apTestModel');
const transferCreditService = require('../services/transfer-credit-service');

module.exports = async ({ deleteTests = true } = {}) => {
    await mongoose.connection.transaction(async () => {
        console.log('fetching AP tests');

        if (deleteTests) // remove old tests
            await APTest.deleteMany({});

        const credits = await transferCreditService.getAPCredits();

        await APTest.insertMany(credits);

        console.log('AP test sync finished');
    });
};
