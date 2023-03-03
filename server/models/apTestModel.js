const mongoose = require('mongoose');

const apTestSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    credits: [{
        _id: false, // dont need id on sub schema
        score: Number,
        courses: [{
            _id: false, // dont need id on sub schema
            courseID: String,
            subject: String
        }],
    }]
});

module.exports = mongoose.model('APTest', apTestSchema);
