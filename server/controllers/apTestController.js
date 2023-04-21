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

    req.body.forEach(c => {
        const test = tests.find(t => t._id.toString() === c.test);
        if (!test) {
            return;
        }
        const testCourses = test.credits.flatMap(c => c.courses);
        const testCreditCourse = test?.credits.find(o => o.score === c.score);
        req.user.completedCourses = [...req.user.completedCourses.filter(course => {
            if (course.source !== test.type) return true;
            return !testCourses.some(testCourse => course.courseID === testCourse.courseID
                && course.subject === testCourse.subject);
        }) ]
        if (!test || !testCreditCourse)
            return;
        req.user.completedCourses = [...req.user.completedCourses,
            ...testCreditCourse.courses.map(c => ({
            courseID: c.courseID,
            subject: c.subject,
            grade: 'P',
            year: new Date().getFullYear(),
            semester: 'Fall',
            source: test.type
        }))];
    });

    await req.user.save();
    res.json({});
};
