const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
    courseID: String,
    subject: String,
    grade: String,
    semester: { type: String, enum: ['Spring', 'Summer', 'Fall'] },
    year: Number,
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    courseData: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
})
exports.schema = userCourseSchema;

module.exports = mongoose.model('UserCourse', userCourseSchema);
