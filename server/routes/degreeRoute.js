const { Router } = require('express');
const Degree = require('../models/degreeModel');

module.exports = app => {
    const router = new Router();

    router.get('/', async (req, res) => {
        return res.json(await Degree.find({}));
    });

    app.use('/api/degrees', router);
};
