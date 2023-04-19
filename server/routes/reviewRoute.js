const { Router } = require('express');
const mongoose = require('mongoose');

const Course = require('../models/courseModel');
const Instructor = require('../models/instructorModel');
const {Rating} = require("../models/ratingModel");
const toTitleCase = require("../utils/title-case");
const ReviewService = require("../services/review-service");

module.exports = app => {
    const router = Router();
    const { authenticate } = require('../middleware/authenticate');
    router.get('/saveReview', async (req, res) => {
        if (typeof req.query.in_email !== 'string' || typeof req.query.in_dateSubmitted !== 'string' || typeof req.query.in_courseSubject !== 'string' || typeof req.query.in_courseID !== 'string' || typeof req.query.instructor_fname !== 'string' || typeof req.query.instructor_lname !== 'string' || typeof req.query.in_wouldTakeAgain !== 'boolean' || typeof req.query.rating !== 'string' || typeof req.query.rating !== 'number' || typeof req.query.comment !== 'string' || typeof req.query.in_grade !== 'string') {
            return res.status(400).json({ message: 'invalid input' });
        }
        await ReviewService.saveReview(instructor = req.query.instructor, course = req.query.course);

        return reviews;
    });
    app.use('/api/reviews', router);
}