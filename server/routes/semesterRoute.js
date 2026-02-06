const { Router } = require('express');
const Semester = require('../models/semesterModel');

module.exports = app => {
    const router = Router();

    router.get('/', async (req, res) => {
        return res.json(await Semester.find());
    });

    app.use('/api/semesters', router);
};
