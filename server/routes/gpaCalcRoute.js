const { Router } = require('express');
const Course = require('../models/courseModel');
const Section = require('../models/sectionModel');
const Semester = require('../models/semesterModel');

const mongoose = require('mongoose');

module.exports = app => {
    const router = Router();
    
    router.get('/', async (req, res) => {
        if (typeof req.query.subject !== 'string' || typeof req.query.courseID !== 'string')
        return res.status(400).json({ message: 'invalid input' });
    });

    app.use('/api/gpaCalc', router);
}