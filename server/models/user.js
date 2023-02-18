const mongoose = require('mongoose');

/* Create a user schema */
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

module.exports = mongoose.model('User', userSchema);