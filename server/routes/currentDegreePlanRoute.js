const { Router } = require('express');

module.exports = app => {
    const router = Router();
    const { authenticate } = require('../middleware/authenticate');
    const controller = require('../controllers/currentDegreePlanController');

    /* Add HTTP requests for managing user data */
    router.post('/addCourse', authenticate, controller.addCourse);          /* Adds new course to historical plan */
    router.post('/modifyCourse', authenticate, controller.modifyCourse);    /* Modifies existing course in historical plan */
    router.delete('/deleteCourse', authenticate, controller.deleteCourse);  /* Deletes existing course in historical plan */

    /* Add above reuests as a subdirectory of /user */
    app.use('/api/degreeplan/current', router);
};