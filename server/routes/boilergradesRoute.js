const { Router } = require('express');
const boilergrades = require('../services/boiler-grades');

module.exports = app => {
    const router = Router();

    router.get('/course', async (req, res) => {
        try {
            res.json(await boilergrades.getBGCourse(req.query))
        } catch {
            res.status(404).json({ message: 'No boilergrades found' });
        }
    })

    router.get('/instructor', async (req, res) => {
        try {
            res.json(await boilergrades.getBGInstructor(req.query.first, req.query.last))
        } catch {
            res.status(404).json({ message: 'No boilergrades found' });
        }
    })

    app.use('/api/boilergrades', router);
};