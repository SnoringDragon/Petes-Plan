const mongoose = require('mongoose');

//Includes schemas for: course, userCourse, semester, instructor, section

/* Resources: https://mongoosejs.com/docs/guide.html#definition */
/* https://stackoverflow.com/questions/43534461/array-of-subdocuments-in-mongoose */ 

const courseAttributeSchema = new mongoose.Schema({
    code: String,
    name: String
}, { _id: false });

/* Create a course schema - US5 */
const courseSchema = new mongoose.Schema({
    name: String,

    subject: String, // CS, MA, etc.
    courseID: String, // 18000, 24000, etc

    // array of various ways to represent this course ID, used for search index
    // example: ['ECE 20001', 'ECE20001', 'ECE 2k1', 'ECE2k1']
    // example: ['CS 18000', 'CS18000', 'CS 180', 'CS180']
    searchCourseID: String,

    minCredits: Number,
    maxCredits: Number,

    // various attributes such as variable title, etc
    attributes: [courseAttributeSchema],

    description: String,
    requirements: Object,
    // semesters: { TODO: update this later when pulling scheduling info
    //     type: [semesterSchema],
    // }
});

courseSchema.index({ subject: 1, courseID: 1 }, { unique: true });
courseSchema.index({
    name: 'text',
    searchCourseID: 'text',
    description: 'text'
}, {
    weights: { // arbitrarily chosen weights, higher is more important
        name: 3,
        searchCourseID: 50,
        description: 1
    }
})

module.exports = mongoose.model('Course', courseSchema);
