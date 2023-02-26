const mongoose = require('mongoose');

//Includes schemas for: course, userCourse, semester, instructor, section

/* Resources: https://mongoosejs.com/docs/guide.html#definition */
/* https://stackoverflow.com/questions/43534461/array-of-subdocuments-in-mongoose */ 

/* Create a course schema - US5 */
const courseSchema = new mongoose.Schema({
    name: String,
    courseID: String,
    credits: Number,
    description: String,
    semesters: {
        type: [semesterSchema],  
    },
    prerequisites: {
        type: [courseSchema]
    }
});

module.exports = mongoose.model('Course', courseSchema);