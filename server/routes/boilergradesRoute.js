const { Router } = require('express');
const Boilergrades = require('../models/boilergradesModel');
const Course = require('../models/courseModel');
const Instructor = require('../models/instructorModel');
const mongoose = require('mongoose');

module.exports = app => {
    const router = Router();

    router.get('/course', async (req, res) => {
        let course = null;

        if (req.query.course) {
            try {
                course = await Course.findOne({ _id: mongoose.Types.ObjectId(req.query.course) })
            } catch {}
        } else if (req.query.courseID && req.query.subject) {
            course = await Course.findOne({ courseID: req.query.courseID, subject: req.query.subject });
        }

        if (!course)
            return res.status(400).json({ message: 'Invalid course' });

        res.json(await Boilergrades.find({ course })
            .populate('section')
            .populate('semester')
            .populate('instructor'));
    })

    router.get('/instructor', async (req, res) => {
        let instructor = null;

        if (req.query.instructor) {
            try {
                instructor = await Instructor.findOne({ _id: mongoose.Types.ObjectId(req.query.instructor) })
            } catch {}
        } else if (req.query.email) {
            instructor = await Instructor.findOne({ email: req.query.email });
        }

        if (!instructor)
            return res.status(400).json({ message: 'Invalid instructor' });

        res.json(await Boilergrades.find({ instructor })
            .populate('course')
            .populate('section')
            .populate('semester'));
    })

    app.use('/api/boilergrades', router);
};
