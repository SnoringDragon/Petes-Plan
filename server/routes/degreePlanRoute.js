const { Router } = require('express');

module.exports = app => {
    const router = Router();
    const { authenticate } = require('../middleware/authenticate');
    const controller = require('../controllers/degreePlanController');

    /* Add HTTP requests for managing degree plan data */
    router.get('/', authenticate, controller.getDegreePlans);               /* Returns list of degree plans */
    router.post('/create', authenticate, controller.addDegreePlan);         /* Creates a new degree plan */
    router.delete('/delete', authenticate, controller.deleteDegreePlan);    /* Deletes existing degree plan */

    /* Add HTTP requests for managing courses in a degree plan */
    router.post('/*/add', authenticate, controller.addCourse);              /* Adds a course to a degree plan */
    router.post('/*/modify', authenticate, controller.modifyCourse);        /* Updates a course in a degree plan (e.g. grade, semester, etc.) */
    router.delete('/*/remove', authenticate, controller.removeCourse);      /* Removes a course from a degree plan */
    router.get('/*', authenticate, controller.getDegreePlan);               /* Returns degree plan data */

    /* Add above reuests as a subdirectory of /degreePlan */
    app.use('/api/degreePlan', router);
};