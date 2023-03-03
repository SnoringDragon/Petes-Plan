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
    /* Check if the user has provided an email, password, and name */
    if (!req.body.email || !req.body.password || !req.body.name) {
        return res.status(400).json({
            message: 'Missing email, password, or name'
        });
        return;
    }
    
    /* Validate email address */
    //TODO: Check if email matches a known university domain
    const email = req.body.email.toLowerCase();
    if (!email.match(emailRegex)) {
        return res.status(400).json({
            message: 'Invalid email address'
        });
        return;
    }

    /* Check if the user already exists */
    if (await User.exists({ email: email })) {
        return res.status(400).json({
            message: 'User already exists'
        });
        return;
    }

    /* Populate the user object */
    const token = generateToken(email, '30 days');
    bcrypt.hash(req.body.password, 10).then(async (hash) => {
        const user = new User({
            name: req.body.name,
            email: email,
            verified: false,
            password: hash,
            verificationToken: await token
        });

        /* Save the user to the database */
        user.save().then(async () => {
            /* Send a verification email */
            mailer.sendEmail(email, 'Email Verification', 'verifyEmail', {
                name: req.body.name,
                baseUrl: process.env.BASE_URL,
                email: encodeURIComponent(email),
                token: encodeURIComponent(await token)
            });

            return res.status(201).json({
                message: 'User added successfully!'
            });
        }).catch((error) => {
            console.log(error);
            return res.status(500).json({
                message: 'Could not create user'
            });
        });
    });
};

/* Verify a user's email */
exports.verifyEmail = async (req, res) => {
    const email = req.body.email ?? req.query.email;
    const token = req.body.token ?? req.query.token;

    /* Checks if the email and token are provided */
    if (!email || !token) {
        return res.status(400).json({
            message: 'Missing email or token'
        });
    }

    User.find({ email: email.toLowerCase() }, async (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        const user = docs[0];

        /* Check if the user exists and token matches */
        if (user && (user.verified === false) && (user.verificationToken === token)) {
            if (!await user.validatePassword(req.body.password))
                return res.status(400).json({ message: 'Invalid password' });

            /* Update the user's details */
            user.verified = true;
            user.verificationToken = '';
            user.save().catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            });

            return res.status(200).json({
                message: 'Email verified successfully'
            });
        } else {
            return res.status(400).json({
                message: 'Invalid email token pair'
            });
        }
    });
};

/* Login a user */
exports.login = async (req, res) => {
    /* Check if the user has provided an email and password */
    if (!req.body.email || !req.body.password)
        return res.status(400).json({
            message: 'Missing email or password'
        });
        
    /* Validate email address */
    const email = req.body.email.toLowerCase();
    if (!email.match(emailRegex))
        return res.status(400).json({
            message: 'Invalid email address'
        });

    const user = await User.findOne({ email: email });

    // no user with that email
    if (!user || !user.verified || !await user.validatePassword(req.body.password))
        return res.status(400).json({
            message: 'Invalid email password pair'
        });

    await user.filterBlacklist();

    // return token as signed payload
    return res.status(201).json({
        token: jwt.sign({ _id: user._id }, user.permuteKey(secret), {
            expiresIn: req.body.remember ? '30 days' : '1 day'
        }),
        // whether the token should be stored in localStorage or sessionStorage
        storage: req.body.remember ? 'local' : 'session'
    });
};

/* Send user a password reset email */
exports.resetRequest = async (req, res) => {
    /* Check if the user has provided an email */
    if (!req.body.email) {
        return res.status(400).json({
            message: 'No email provided'
        });
        return;
    }
    
    /* Validate email address */
    const email = req.body.email.toLowerCase();
    if (!email.match(emailRegex)) {
        return res.status(400).json({
            message: 'Invalid email address'
        });
        return;
    }

    /* Check if the user already exists */
    const user = await User.findOne({ email: email });
    if (user && user.verified) {
        /* Generate a new token */
        const token = generateToken(email, '24 hours');

        /* Update the user's details */
        user.verificationToken = await token;
        user.save().catch((error) => {
            console.log(error);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });

        /* Send a reset email */
        mailer.sendEmail(email, 'Password Reset', 'resetPassword', {
            name: user.name,
            email: encodeURIComponent(email),
            token: encodeURIComponent(await token),
            baseUrl: process.env.BASE_URL
        });
    }

    return res.status(201).json({
        message: 'Password reset email sent'
    });
};

/* Reset a user's password */
exports.resetPassword = async (req, res) => {
    /* Check if the user has provided an email, token, and new password */
    if (!req.body.email || !req.body.token || !req.body.password) {
        return res.status(400).json({
            message: 'Missing email, token, or password'
        });
    }

    /* Validate email address */
    const email = req.body.email.toLowerCase();
    if (!email.match(emailRegex)) {
        return res.status(400).json({
            message: 'Invalid email address'
        });
    }

    /* Check if the user exists and token matches */
    const user = await User.findOne({ email: email });
    if (user && (user.verified === true) && (user.verificationToken === req.body.token)) {
        /* Update the user's details */
        user.password = await bcrypt.hash(req.body.password, 10);
        user.verificationToken = '';
        user.save().catch((err) => {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });

        return res.status(201).json({
            message: 'Password reset successfully'
        });
    } else {
        return res.status(400).json({
            message: 'Invalid email token pair'
        });
    }
};

/* Logout a user */
exports.logout = async (req, res) => {
    req.user.tokenBlacklist.push(req.token);
    req.user.filterBlacklist();
    return res.status(200).json({
        message: 'Logged out successfully'
    });
};

/* Delete a user */
exports.delete = async (req, res) => {
    User.deleteOne({ email: req.user.email }, () => {
        return res.status(200).json({
            message: 'User deleted successfully'
        });
    });
};

/* Update a user's details */
exports.update = async (req, res) => {
    const user = req.user;
    var updated = false;

    /* Check for updated name */
    if (req.body.name && !(req.body.name === user.name)) {
        user.name = req.body.name;
        updated = true;
    }

    /* Save the user */
    if (updated) {
        user.save().then(() => {
            return res.status(200).json({
                message: 'User updated successfully'
            });
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });
    } else {
        return res.status(200).json({
            message: 'No changes made'
        });
    }
};

exports.getUser = (req, res) => {
    res.json(req.user);
};