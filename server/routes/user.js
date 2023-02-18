const { Router } = require('express');

module.exports = app => {
    const router = Router();
    const userController = require('../controllers/user');

    /* Add HTTP requests for managing user data */
    router.post('/signup', userController.signup);              /* Create a new user */
    router.get('/verifyemail', userController.verifyEmail);     /* Verify a user's email */
    router.post('/login', userController.login);                /* Login a user */
    router.get('/verifytoken', userController.verifyToken);     /* Verify a user's token */
    router.post('/logout', userController.logout);              /* Logout a user */
    router.delete('/delete', userController.delete);            /* Delete a user */
    router.put('/update', userController.update);               /* Update a user's details */

    /* Add above reuests as a subdirectory of /user */
    app.use('/api/user', router);
};