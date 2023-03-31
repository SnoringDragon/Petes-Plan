const { Router } = require('express');
const GPACalc = require('../utils/GPACalc');

const mongoose = require('mongoose');

module.exports = app => {
    const router = Router();
    router.get('/cumulativeGPA', async (req, res) => {
        const gpa = await GPACalc.cumulativeGPA(req, res);
        return gpa;
    });

    router.get('/semesterGPA', async (req, res) => {
        if (typeof req.query.semesterInput !== 'string' || typeof req.query.yearInput !== int)
            return res.status(400).json({ message: 'invalid semester input' });

        const gpa = await GPACalc.semesterGPA(req, res, req.query.semesterInput, req.query.yearInput);
        return gpa;
    });

    router.get('/majorGPA', async (req, res) => {
        if (typeof req.query.major !== 'string')
            return res.status(400).json({ message: 'invalid major input' });

        const gpa = await GPACalc.majorGPA(req, res, req.query.major);
        return gpa;
    });

    app.use('/api/GPA', router);

}