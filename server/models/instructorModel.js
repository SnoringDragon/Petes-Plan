const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
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


module.exports = mongoose.model('Instructor', instructorSchema);
