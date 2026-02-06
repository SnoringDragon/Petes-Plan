const { Router } = require('express');

module.exports = app => {
    const router = new Router();
    const controller = require('../controllers/apTestController');
    const { authenticate } = require('../middleware/authenticate');

    router.get('/all', controller.listApTests);
    router.get('/', authenticate, controller.getUserApTests);
    router.post('/', authenticate, controller.modifyUserApTest);

    app.use('/api/ap-tests', router);
};
