const mongoose = require('mongoose');

const APTest = require('../models/apTestModel');

module.exports.listApTests = async (req, res) => {
    res.json(await APTest.find({}));
};

module.exports.getUserApTests = async (req, res) => {
    return res.json((await req.user.populate('apTests.test')).apTests);
};

module.exports.modifyUserApTest = async (req, res) => {
    if (!Array.isArray(req.body))
        return res.status(400).json({ message: 'expected array as body' });

    // if (req.body.some(c => ![1,2,3,4,5].includes(c?.score)))
    //     return res.status(400).json({ message: 'unexpected score' });

    if (req.body.some(c => {
        try {
            // ensure correct object id
            mongoose.Types.ObjectId(c?.test)
            return false;
        } catch (e) {
            return true;
        }
    }))
        return res.status(400).json({ message: 'unexpected test' });

    const tests = await APTest.find()
        .where('_id').in(req.body.map(c => c.test));

    // object id not a valid test
    if (tests.length !== req.body.length)
        return res.status(400).json({ message: 'unexpected test' });

    req.user.apTests = req.body.map(c => ({
        test: mongoose.Types.ObjectId(c.test),
        score: c.score
    }));

    await req.user.save();
    res.json({});
};
