const User = require('../models/userModel');
const mailer = require('./emailController');

/* Generate a unique token for a user */
async function generateToken(email) {
    //TODO Implement token generation

    const token = 'token';

    return token;
}

/* Hash user's password with random salt */
async function hashPassword(password) {
    //TODO Implement password hashing with ransom salt

    const salt = "salty";
    const hash = "hashpass";

    return {salt: salt, hash: hash};
}

/* Create a new user */
exports.signup = async (req, res) => {
    //TODO Actually implement properly, this is just a database test currently
    /* Resource: https://openclassrooms.com/en/courses/5614116-go-full-stack-with-node-js-express-and-mongodb/5656271-create-new-users */
    
    const email = req.body.email.toLowerCase();
    const password = await hashPassword(req.body.password);
    const token = await generateToken(req.body.email);
    const user = new User({
        email: email,
        verified: false,
        passwordSalt: password.salt,
        passwordHash: password.hash,
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