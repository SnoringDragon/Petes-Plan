const mongoose = require('mongoose');

const APTest = require('../models/apTestModel');
const transferCreditService = require('../services/transfer-credit-service');

module.exports = async ({ deleteTests = true } = {}) => {
    await mongoose.connection.transaction(async () => {
        console.log('fetching AP tests');

        const tests = await APTest.find({});

        if (deleteTests) // remove old tests
            await APTest.deleteMany({});

        const credits = await transferCreditService.getAPCredits();

        await APTest.bulkWrite(credits.map(credit => {
            // preserve ids if deleting
            const previousId = tests.find(other => other.name === credit.name)?._id;

            return {
                updateOne: {
                    // find by name or id if id is set
                    filter: (previousId ? { _id: previousId } : { name: credit.name }),
                    update: { $set: { ...credit, _id: previousId } },
                    upsert: true
                }
            }
        }));

        console.log('AP test sync finished');
    });
};
