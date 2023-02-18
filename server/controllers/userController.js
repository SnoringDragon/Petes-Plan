const User = require('../models/userModel');
const email = require('./emailController');

/* Create a new user */
exports.signup = async (req, res) => {
    //TODO Actually implement properly, this is just a database test currently
    /* Resource: https://openclassrooms.com/en/courses/5614116-go-full-stack-with-node-js-express-and-mongodb/5656271-create-new-users */
    const newuser = new User({ email: req.body.email.toLowerCase(), password: req.body.password });
    newuser.save();

    /* Send a verification email */
    await email.sendEmail('example@gmail.com', 'Email Verification', 'verifyEmail', {
        username: 'input username here',
        email: 'input email here',
        token: 'input token here'
    });

    res.send('User created');
};

/* Verify a user's email */
exports.verifyEmail = async (req, res) => {

};

/* Login a user */
exports.login = async (req, res) => {

};

/* Verify a user's token */
exports.verifyToken = async (req, res) => {

};

/* Logout a user */
exports.logout = async (req, res) => {

};

/* Delete a user */
exports.delete = async (req, res) => {

};

/* Update a user's details */
exports.update = async (req, res) => {

};