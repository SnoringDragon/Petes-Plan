const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
    courseID: String,
    grade: Number,
    semester: { type: String, enum: ['Spring', 'Summer', 'Fall'] },
    year: Number,
    section: Number // CRN
})
exports.schema = userCourseSchema;

module.exports = mongoose.model('UserCourse', userCourseSchema);
