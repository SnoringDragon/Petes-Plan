const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const mailer = require('./emailController');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
delete process.env.JWT_SECRET_KEY;

/* Generate a unique token for a user */
async function generateToken(email) {
    return jwt.sign({ email }, SECRET_KEY, {
        expiresIn: '30 days'
    });
}

/* Create a new user */
exports.signup = async (req, res) => {
    //TODO Actually implement properly, this is just a database test currently
    /* Resource: https://openclassrooms.com/en/courses/5614116-go-full-stack-with-node-js-express-and-mongodb/5656271-create-new-users */
    
    const email = req.body.email.toLowerCase();
    const token = await generateToken(req.body.email);
    const user = new User({
        email: email,
        verified: false,
        password: req.body.password,
        verificationToken: token
    });
    user.save();

    /* Send a verification email */
    await mailer.sendEmail(email, 'Email Verification', 'verifyEmail', {
        username: 'input username here',
        email: email,
        token: token
    });

    res.send('User created');
};

/* Verify a user's email */
exports.verifyEmail = async (req, res) => {
    User.find({ email: req.query.email.toLowerCase() }, (err, docs) => {
        if (err) {
            //TODO Set up error handling
            console.log(err);
            return;
        }
        const user = docs[0];

        /* Check if the user exists and token matches */
        if (user && (user.verificationToken === req.query.token)) {
            user.verified = true;
            user.save();
            res.send('Email verified'); //TODO Display a verified page instead
        } else {
            res.send('Invalid token'); //TODO Display an invalid token page instead
        }
    });
};

/* Login a user */
exports.login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    // no user with that email
    if (!user)
        return res.status(400).json({
            error: true,
            message: 'Invalid email'
        });

    // invalid password
    if (!await user.validatePassword(req.body.password))
        return res.status(400).json({
            error: true,
            message: 'Invalid password'
        });

    // return token as signed payload
    return res.json({
        error: false,
        token: await jwt.sign(user.toJSON(), SECRET_KEY, {
            expiresIn: req.body.remember ? '30 days' : '1 day'
        }),
        // whether the token should be stored in localStorage or sessionStorage
        storage: req.body.remember ? 'local' : 'session'
    });
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