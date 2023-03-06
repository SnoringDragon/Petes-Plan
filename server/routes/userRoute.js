const { Router } = require('express');

module.exports = app => {
    const router = Router();
    const { authenticate } = require('../middleware/authenticate');
    const userController = require('../controllers/userController');

    /* Add HTTP requests for managing user data */
    router.post('/signup', userController.signup);                  /* Create a new user */
    router.post('/verifyemail', userController.verifyEmail);         /* Verify a user's email */
    router.post('/login', userController.login);                    /* Login a user */
    router.post('/resetrequest', userController.resetRequest);      /* Send email to reset password */
    router.post('/resetpassword', userController.resetPassword);    /* Reset a user's password */
    router.post('/logout', authenticate, userController.logout);    /* Logout a user */
    router.delete('/delete', authenticate, userController.delete);  /* Delete a user */
    router.put('/update', authenticate, userController.update);     /* Update a user's details */
    router.get('/', authenticate, userController.getUser);          /* get user info */

    /* Add above reuests as a subdirectory of /user */
    app.use('/api/user', router);
};