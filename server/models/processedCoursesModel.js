const mongoose = require('mongoose');

// helper schema to determine which semester-course combo have already been processed

const schema = new mongoose.Schema({
    subject: String, // course catalog subject name
    semester: String, // course catalog semester id,

}, {timestamps: true});

schema.index({ subject: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('ProcessedCourse', schema);
