const { Router } = require('express');
const mongoose = require('mongoose');
const Section = require('../models/sectionModel');

module.exports = app => {
    const router = Router();

    router.get('/', async (req, res) => {
        try {
            mongoose.Types.ObjectId(req.query.id)
        } catch {
            return res.status(400).json({ message: 'invalid section id' });
        }

        return res.json(await Section.findOne({ id: req.query.id })
            .populate('semester')
            .populate('course')
            .populate('meetings.instructors'));
    });

    app.use('/api/sections', router);
};
