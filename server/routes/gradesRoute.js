const { Router } = require('express');
const { authenticate } = require('../middleware/authenticate');

module.exports = app => {
    const router = Router();

    router.get('/', (req, res) => {
        res.json(req.user.grades ?? []);
    });

    router.post('/', async (req, res) => {
        req.user.grades = req.body;
        await req.user.save();
        res.json({});
    })

    app.use('/api/grades', authenticate, router);
};
