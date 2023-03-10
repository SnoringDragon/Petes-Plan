const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
        sparse: true
    },
});


module.exports = mongoose.model('Instructor', instructorSchema);
