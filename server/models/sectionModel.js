const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    instructor: instructorSchema,
    days: String,
    crn: Number,
    name: String,
    startTime: Date,
    endTime: Date,
    location: String,
    type: String
});

module.exports = mongoose.model('Section', sectionSchema);