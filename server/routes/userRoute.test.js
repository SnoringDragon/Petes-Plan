const { getLatestEmail } = require('../mail.jest')

describe('account creation', () => {
    it('should create an admin account', async () => {
        const res = await request(getApp()).post('/api/user/signup', {
            email: process.env.ADMIN_EMAIL,
            password: 'hunter2',
            name: 'Admin'
        });

        console.log(res);
    });
});