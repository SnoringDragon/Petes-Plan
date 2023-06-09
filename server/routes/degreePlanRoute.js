const { Router } = require('express');

module.exports = app => {
    const router = Router();
    const { authenticate } = require('../middleware/authenticate');
    const controller = require('../controllers/degreePlanController');

    /* Add HTTP requests for managing degree plan data */
    router.get('/', authenticate, controller.getDegreePlans);               /* Returns list of degree plans */
    router.post('/create', authenticate, controller.addDegreePlan);         /* Creates a new degree plan */
    router.delete('/delete', authenticate, controller.deleteDegreePlan);    /* Deletes existing degree plan */

    /* Add HTTP requests for managing degrees/courses in a degree plan */
    router.post('/*/add', authenticate, controller.addCourse);              /* Adds degrees/courses to a degree plan */
    router.delete('/*/remove', authenticate, controller.removeCourse);      /* Removes degrees/courses from a degree plan */
    router.get('/*/gradReqs', authenticate, controller.getGradReqs);        /* Returns graduation requirements for a degree plan */
    router.get('/*/gradReqsIntersect/*', authenticate, controller.getReqIntersection); /* Returns intersection of requiremtns between one degree and a degree plan  */
    router.get('/*/courseRecommendations', authenticate, controller.getRecommendedCourses); /* Returns ordered list of recommended courses */
    router.get('/*', authenticate, controller.getDegreePlan);               /* Returns degree plan data */

    /* Add above reuests as a subdirectory of /degreePlan */
    app.use('/api/degreePlan', router);
};