const { Router } = require('express');
const Review = require('../services/review-service.js');

const mongoose = require('mongoose');

module.exports = app => {
    const router = Router();
    router.get('/', async (req, res) => {
        if (typeof req.query.weights !== 'object' || typeof req.query.assignments !== 'object') {
            return res.status(400).json({ message: 'invalid input' });
        }
        const reviews = await Review.calculateGrade(instructor = req.query.instructor, course = req.query.course);

        return reviews;
    });
    app.use('/api/reviews', router);
}