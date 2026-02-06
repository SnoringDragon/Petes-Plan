const { Router } = require('express');
const mongoose = require('mongoose');
const { authenticate } = require('../middleware/authenticate');
const User = require('../models/userModel');

module.exports = app => {
    const router = Router();

    router.get('/', async (req, res) => {
        return res.json(await User.find({}).select({
            _id: 1,
            name: 1,
            email: 1,
            verified: 1,
            isAdmin: 1
        }));
    });

    router.post('/:id', async (req, res) => {
        if (req.user.email !== process.env.ADMIN_EMAIL)
            return res.status(403).json({ message: 'Only the main admin may perform this action' });
        try {
            const user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

            if (!user)
                return res.status(400).json({ message: 'Invalid user id' });

            if (user.email === process.env.ADMIN_EMAIL)
                return res.status(400).json({ message: 'This user cannot be modified' });


            const keys = ['isAdmin'];

            keys.forEach(key => {
                if (key in req.body)
                    user[key] = req.body[key];
            });

            await user.save();
            return res.json({});
        } catch (e) {
            console.error(e);
            return res.status(400).json({ message: 'Invalid user id' });
        }
    });

    app.use('/api/admin/user', authenticate, (req, res, next) => {
        if (!req.user.isAdmin)
            return res.status(403).json({ message: 'Unauthorized' });
        next();
    }, router);
}
