const jwt = require("jsonwebtoken");
const tasks = require('../tasks');

let adminToken;

beforeAll(async () => {
    const User = require('../models/userModel');
    await User.deleteMany({});

    await User.create({
        email: process.env.ADMIN_EMAIL,
        name: 'Admin',
        password: '$2b$10$jSuUuJz6DCTgYN/Pj8KpBe.ccLN8pr70TyXVJYry3YQXq.6nBapWu',
        verified: true,
        isAdmin: true
    });

    await User.create({
        email: "notanadmin@purdue.edu",
        name: 'Not An Admin',
        password: '$2b$10$jSuUuJz6DCTgYN/Pj8KpBe.ccLN8pr70TyXVJYry3YQXq.6nBapWu',
        verified: true,
        isAdmin: false
    })

    await tasks();
})

describe('Scheduled Tasks', () => {

    it('should have some tasks', async () => {
        const t = tasks();
        expect(t).toBeInstanceOf(Array);
        expect(t).not.toStrictEqual([]);
    });

    it('should not allow non-admin access', async () => {
        const res = await request(getApp()).post('/api/user/login')
            .send({ email: "notanadmin@purdue.edu", password: 'hunter2' })
            .expect(201);

        await request(getApp())
            .get('/api/admin/scheduled-task')
            .set('Authorization', `Bearer ${res.body.token}`)
            .expect(403);
    });

    it('should allow admin access', async () => {
        const res = await request(getApp()).post('/api/user/login')
            .send({ email: process.env.ADMIN_EMAIL, password: 'hunter2' })
            .expect(201);
        adminToken = res.body.token;

        const taskRes = await request(getApp())
            .get('/api/admin/scheduled-task')
            .set('Authorization', `Bearer ${res.body.token}`)
            .expect(200);

        expect(taskRes.body).toStrictEqual(JSON.parse(JSON.stringify(tasks())))
    });

    it('should run tasks', async () => {
        const t = tasks().find(t => t.model.name.includes('Course Catalog'));

        await request(getApp()).post('/api/admin/scheduled-task/run')
            .send({
                id: t.model._id.toString(),
            })
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

        expect(t.status).toBe('running')

        await request(getApp()).post('/api/admin/scheduled-task/abort')
            .send({
                id: t.model._id.toString(),
            })
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)
        expect(t.status).toBe('aborted')
    });

    it('should force run tasks', async () => {
        const t = tasks().find(t => !t.model.name.includes('Course Catalog'));
        await request(getApp()).post('/api/admin/scheduled-task/run')
            .send({
                id: t.model._id.toString(),
                force: true,
            })
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)

        expect(t.status).toBe('running')

        await request(getApp()).post('/api/admin/scheduled-task/abort')
            .send({
                id: t.model._id.toString(),
            })
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)
        expect(t.status).toBe('aborted')

    });

    it('should reschedule tasks', async () => {
        const t = tasks().find(t => !t.model.name.includes('Course Catalog'));
        await request(getApp()).post('/api/admin/scheduled-task/reschedule')
            .send({
                id: t.model._id.toString(),
                time: '* * * * *',
            })
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)

        expect(t.model.scheduledAt).toBe('* * * * *')
    })

    it('should not reschedule given invalid time', async () => {
        const t = tasks().find(t => !t.model.name.includes('Course Catalog'));
        await request(getApp()).post('/api/admin/scheduled-task/reschedule')
            .send({
                id: t.model._id.toString(),
                time: 'asdasdasd',
            })
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(400)

    })

});
