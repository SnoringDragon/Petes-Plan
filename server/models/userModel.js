const mongoose = require('mongoose');
const crypto = require('crypto');

/* Resource: https://mongoosejs.com/docs/ */

/* Create a user schema */
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    verified: Boolean,
    verificationToken: String,
});

/* modify secret key by xor-ing it with hash of user's password
*  password changes will then invalidate the secret key */
userSchema.methods.permuteKey = function(secretKey) {
    // compute sha256 hash of password
    const hash = crypto.createHash('sha256')
        .update(this.password).digest();

    return Buffer.alloc(Math.max(hash.length, secretKey.length)) // create buffer of whatever is the max length
        .map((_, i) => secretKey[i % secretKey.length] ^ hash[i % hash.length]); // xor the secret key with password hash
}

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
