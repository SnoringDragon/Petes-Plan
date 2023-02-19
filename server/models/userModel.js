const mongoose = require('mongoose');

/* Resource: https://mongoosejs.com/docs/ */

/* Create a user schema */
const userSchema = new mongoose.Schema({
    email: String,
    passwordSalt: String,
    passwordHash: String,
    verified: Boolean,
    verificationToken: String,
});

module.exports = mongoose.model('User', userSchema);