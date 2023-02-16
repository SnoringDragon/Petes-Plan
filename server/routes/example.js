const { Router } = require('express');

module.exports = app => {
    const router = Router();

    router.get('/world', (res, req) =>
        req.send('hello world'));

    app.use('/hello', router);
};