const mongoose = require('mongoose');

//Includes schemas for: Degree, University, semester, instructor, section

/* Resources: https://mongoosejs.com/docs/guide.html#definition */
/* https://stackoverflow.com/questions/43534461/array-of-subdocuments-in-mongoose */ 

/* Create a course schema - US5 */
const degreeSchema = new mongoose.Schema({
    name: String,
    type: ['major', 'minor', 'concentration', 'certificate'],
    requirements: [courseSchema],
    concentrations: [degreeSchema]
});

const departmentSchema = new mongoose.Schema({
    name: String,
    degrees: [degreeSchema],
    requirements: [courseSchema]
})

const collegeSchema = new mongoose.Schema({
    name: String,
    departments: [departmentSchema],
    requirements: [courseSchema]
});

const universitySchema = new mongoose.Schema({
    name: String,
    colleges: [collegeSchema],
    requirements: [courseSchema],
    emailDomain: String,
    users: [userSchema]
});