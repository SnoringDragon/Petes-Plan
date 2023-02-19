const { Router } = require('express');
const jsonParser = require('body-parser').json();

module.exports = app => {
    const router = Router();
    const userController = require('../controllers/userController');

    /* Add HTTP requests for managing user data */
    router.post('/signup', jsonParser, userController.signup);              /* Create a new user */
    router.get('/verifyemail', userController.verifyEmail);                 /* Verify a user's email */
    router.post('/login', jsonParser, userController.login);                /* Login a user */
    router.get('/verifytoken', jsonParser, userController.verifyToken);     /* Verify a user's token */
    router.post('/logout', jsonParser, userController.logout);              /* Logout a user */
    router.delete('/delete', jsonParser, userController.delete);            /* Delete a user */
    router.put('/update', jsonParser, userController.update);               /* Update a user's details */

    /* Add above reuests as a subdirectory of /user */
    app.use('/api/user', router);
};