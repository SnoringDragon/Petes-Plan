const { Router } = require('express');
const Course = require('../models/courseModel');

module.exports = app => {
    const router = Router();

    router.get('/', async (req, res) => {
        if (typeof req.query.subject !== 'string' || typeof req.query.courseID !== 'string')
            return res.status(400).json({ message: 'invalid input' });

        return res.json(await Course.findOne({
            subject: req.query.subject,
            courseID: req.query.courseID
        }));
    });

    router.get('/search', async (req, res) => {
        if (typeof req.query.q !== 'string')
            return res.status(400).json({ message: 'invalid input' });

        return res.json(await Course.find({
            $text: { $search: req.query.q }
        }).sort({
            score: { $meta: 'textScore' }
        }));
    });

    app.use('/api/courses', router);
};
