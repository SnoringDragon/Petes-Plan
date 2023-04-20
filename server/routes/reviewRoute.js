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
        if (typeof req.query.in_email !== 'string' || typeof req.query.in_dateSubmitted !== 'string' || typeof req.query.in_courseSubject !== 'string' || typeof req.query.in_courseID !== 'string' || typeof req.query.instructor_fname !== 'string' || typeof req.query.instructor_lname !== 'string' || typeof req.query.in_wouldTakeAgain !== 'boolean' || typeof req.query.rating !== 'number' || typeof req.query.comment !== 'string' || typeof req.query.in_grade !== 'string') {
            return res.status(400).json({ message: 'invalid input' });
        }
        await ReviewService.saveReview(req.query.in_email, req.query.in_dateSubmitted, req.query.in_courseSubject, req.query.in_courseID, req.query.instructor_fname, req.query.instructor_lname, req.query.in_wouldTakeAgain, req.query.rating, req.query.comment, req.query.in_grade);
    });
    app.use('/api/reviews', router);
}