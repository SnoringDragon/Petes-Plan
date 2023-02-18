const { Router } = require('express');

module.exports = app => {
    const router = Router();

    /* Add 'hello world' request at /world */
    router.get('/world', (req, res) =>
        res.send('hello world'));

    /* Add above reuests as a subdirectory of /hello */
    app.use('/hello', router);
};