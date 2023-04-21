const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
    courseID: String,
    subject: String,
    grade: String,
    semester: { type: String, enum: ['Spring', 'Summer', 'Fall'] },
    year: Number,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    meetingTime: Number,
    courseData: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    source: String
})

exports.schema = userCourseSchema;

module.exports = mongoose.model('UserCourse', userCourseSchema);
