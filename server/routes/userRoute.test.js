const { getLatestEmail } = require('../mail.jest');
const jwt = require('jsonwebtoken');

describe('account creation', () => {
    it('should create an admin account', async () => {
        const User = require('../models/userModel');

        await User.deleteMany({});

        await request(getApp()).post('/api/user/signup').send({
            email: process.env.ADMIN_EMAIL,
            password: 'hunter2',
            name: 'Admin'
        }).expect(201);

        await request(getApp()).post('/api/user/signup').send({
            email: "notanadmin@purdue.edu",
            password: 'hunter2',
            name: 'Not An Admin'
        }).expect(201);

        await User.updateMany({
            email: { $in: [process.env.ADMIN_EMAIL, 'notanadmin@purdue.edu'] }
        }, {
            verified: true
        });
    });

    it('admin account should be an admin', async () => {
        const res = await request(getApp()).post('/api/user/login')
            .send({ email: process.env.ADMIN_EMAIL, password: 'hunter2' })
            .expect(201);

        const payload = jwt.decode(res.body.token);
        expect(payload.isAdmin).toBe(true);
    });

    it('non-admin account should not be an admin', async () => {
        const res = await request(getApp()).post('/api/user/login')
            .send({ email: "notanadmin@purdue.edu", password: 'hunter2' })
            .expect(201);

        const payload = jwt.decode(res.body.token);
        expect(payload.isAdmin).toBeFalsy();
    });

});