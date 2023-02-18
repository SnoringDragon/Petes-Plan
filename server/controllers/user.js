const User = require('../models/user');


/* Create a new user */
exports.signup = (req, res) => {
    //TODO Actually implement properly, this is just a satabase test currently
    const newuser = new User({ email: req.body.email.toLowerCase(), password: req.body.password });
    newuser.save();
    res.send('User created');
};

/* Verify a user's email */
exports.verifyEmail = (req, res) => {

};

/* Login a user */
exports.login = (req, res) => {

};

/* Verify a user's token */
exports.verifyToken = (req, res) => {

};

/* Logout a user */
exports.logout = (req, res) => {

};

/* Delete a user */
exports.delete = (req, res) => {

};

/* Update a user's details */
exports.update = (req, res) => {

};