const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    nickname: String,
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    rateMyProfIds: {
        type: [String],
        unique: true,
        sparse: true
    }
});

instructorSchema.index({ firstname: 1, lastname: 1 });
instructorSchema.index({ firstname: 'text', lastname: 'text', nickname: 'text' }, {
    default_language: 'none' // dont stem names
});


module.exports = mongoose.model('Instructor', instructorSchema);
