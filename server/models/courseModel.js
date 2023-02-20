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

const userCourseSchema = new mongoose.Schema({
    courseID: String,
    grade: Number,
    semester: ['Spring', 'Summer', 'Fall'],
    year: Number,
    sections: [sectionSchema]
})

const semesterSchema = new mongoose.Schema({
    semester: ['Spring', 'Summer', 'Fall'],
    sections: [Section],
});


const instructorSchema = new mongoose.Schema({
    name: String,
    email: String,
});

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