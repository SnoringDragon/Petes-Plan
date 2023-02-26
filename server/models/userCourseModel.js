const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
    courseID: String,
    grade: Number,
    semester: ['Spring', 'Summer', 'Fall'],
    year: Number,
    sections: [sectionSchema]
})

module.exports = mongoose.model('UserCourse', userCourseSchema);
