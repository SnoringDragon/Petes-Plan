const { Router } = require('express');
const ClassGradeCalc = require('../utils/ClassGradeCalc');

const mongoose = require('mongoose');

module.exports = app => {
    const router = Router();
    router.get('/', async (req, res) => {
        if (typeof req.query.weights !== 'object' || typeof req.query.assignments !== 'object') {
            return res.status(400).json({ message: 'invalid input' });
        }
        const grade = await ClassGradeCalc.calculateGrade(weights = req.query.weights, assignments = req.query.assignments);

        return grade;
    });
    app.use('/api/classGrade', router);
}