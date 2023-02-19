const { Router } = require('express');

module.exports = app => {
    const router = Router();
    const { authenticate } = require('../middleware/authenticate');
    const userController = require('../controllers/userController');

    /* Add HTTP requests for managing user data */
    router.post('/signup', userController.signup);              /* Create a new user */
    router.get('/verifyemail', userController.verifyEmail);                 /* Verify a user's email */
    router.post('/login', userController.login);                /* Login a user */
    router.get('/verifytoken', authenticate, userController.verifyToken);     /* Verify a user's token */
    router.post('/logout', authenticate, userController.logout);              /* Logout a user */
    router.delete('/delete', authenticate, userController.delete);            /* Delete a user */
    router.put('/update', authenticate, userController.update);               /* Update a user's details */

    /* Add above reuests as a subdirectory of /user */
    app.use('/api/user', router);
};