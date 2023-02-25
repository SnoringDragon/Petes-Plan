const jwt = require('jsonwebtoken');
const secret = require('../secret');
const User = require('../models/userModel');
const mailer = require('./emailController');
const bcrypt = require('bcrypt');

const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

/* Generate a unique token for a user */
async function generateToken(email, duration) {
    return jwt.sign({ email }, secret, {
        expiresIn: duration
    });
}

/* Create a new user */
exports.signup = async (req, res) => {
    //TODO Actually implement properly, this is just a database test currently
    /* Resource: https://openclassrooms.com/en/courses/5614116-go-full-stack-with-node-js-express-and-mongodb/5656271-create-new-users */
    
    /* Check if the user has provided an email and password */
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            error: 'Missing email or password'
        });
        return;
    }
    
    /* Validate email address */
    const email = req.body.email.toLowerCase();
    if (!email.match(emailRegex)) {
        return res.status(400).json({
            error: 'Invalid email address'
        });
        return;
    }

    /* Check if the user already exists */
    if (await User.exists({ email: email })) {
        return res.status(400).json({
            error: 'User already exists'
        });
        return;
    }

    /* Populate the user object */
    const token = generateToken(email, '30 days');
    bcrypt.hash(req.body.password, 10).then(async (hash) => {
        const user = new User({
            email: email,
            verified: false,
            password: hash,
            verificationToken: await token
        });

        /* Save the user to the database */
        user.save().then(() => {
            res.status(201).json({
                message: 'User added successfully!'
            });
        }).catch((error) => {
            console.log(error);
            res.status(500).json({
                error: 'Could not create user'
            });
        });
    });

    /* Send a verification email */
    mailer.sendEmail(email, 'Email Verification', 'verifyEmail', {
        username: email.substring(0, email.indexOf('@')),
        email: email,
        token: await token
    });
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

    if (!user.verified)
        return res.status(400).json({
            error: true,
            message: 'Email has not been verified yet'
        });

    // invalid password
    if (!await user.validatePassword(req.body.password, hash))
        return res.status(400).json({
            error: true,
            message: 'Invalid password'
        });

    await user.filterBlacklist();

    // return token as signed payload
    return res.json({
        error: false,
        token: await jwt.sign(user.toJSON(), user.permuteKey(secret), {
            expiresIn: req.body.remember ? '30 days' : '1 day'
        }),
        // whether the token should be stored in localStorage or sessionStorage
        storage: req.body.remember ? 'local' : 'session'
    });
};

/* Verify a user's token */
exports.verifyToken = async (req, res) => {
    // authenticate middleware added in userController
    // therefore already authenticated if we are at this point
    return res.json({ error: false });
};

/* Logout a user */
exports.logout = async (req, res) => {
    req.user.tokenBlacklist.push(req.token);
    req.user.filterBlacklist();
    return res.json({ error: false });
};

/* Delete a user */
exports.delete = async (req, res) => {

};

/* Update a user's details */
exports.update = async (req, res) => {

};