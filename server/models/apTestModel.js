const mongoose = require('mongoose');

const APTestSchema = new mongoose.Schema({
    name: String,
    credits: [courseSchema][Number],
    courseID: String
});

module.exports = mongoose.model('APTest', APTestSchema);