const mongoose = require('mongoose');

/* Resource: https://mongoosejs.com/docs/ */

/* Create a user schema */
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    verified: Boolean,
    verificationToken: String,
});

userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.verificationToken;
    delete obj.__v;
    return obj;
};

// https://stackoverflow.com/questions/14588032/mongoose-password-hashing
userSchema.pre('save', async function (next) {
    // don't need to re-hash password if password not modified
    if (!this.isModified('password')) return next();


});

userSchema.methods.validatePassword = async function (data) {
    // TODO: check password to see if it matches hash
    return true;
}

module.exports = mongoose.model('User', userSchema);
