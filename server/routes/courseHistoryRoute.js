const { Router } = require('express');

module.exports = app => {
    const router = Router();
    const { authenticate } = require('../middleware/authenticate');
    const controller = require('../controllers/courseHistoryController');

    /* Add HTTP requests for managing user data */
    router.get('/', authenticate, controller.getCourses);                   /* Returns all courses the user has previously taken */
    router.get('/query', authenticate, controller.queryCourses);            /* Returns all courses the user has previously taken that match the query */
    router.post('/addCourse', authenticate, controller.addCourse);          /* Adds new course to historical plan */
    router.post('/modifyCourse', authenticate, controller.modifyCourse);    /* Modifies existing course in historical plan */
    router.delete('/deleteCourse', authenticate, controller.deleteCourse);  /* Deletes existing course in historical plan */

    /* Add above reuests as a subdirectory of /user */
    app.use('/api/courseHistory', router);
};