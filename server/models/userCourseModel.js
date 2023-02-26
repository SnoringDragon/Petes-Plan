const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
    courseID: String,
    grade: Number,
    semester: ['Spring', 'Summer', 'Fall'],
    year: Number,
    sections: [Number] //list of crns
})
exports.schema = userCourseSchema;

module.exports = mongoose.model('UserCourse', userCourseSchema);
