const { Router } = require('express');
const Degree = require('../models/degreeModel');
const mongoose = require('mongoose');

module.exports = app => {
    const router = new Router();

    router.get('/', async (req, res) => {
        return res.json(await Degree.find({}));
    });

    router.get('/:id', async (req, res) => {
        let _id;

        try {
            _id = mongoose.Types.ObjectId(req.params.id);
        } catch (e) {
            return res.json(null);
        }

        return res.json(await Degree.findOne({ _id }));
    });

    app.use('/api/degrees', router);
};
