const mongoose = require('mongoose');

//Includes schemas for: Degree, University, semester, instructor, section

/* Resources: https://mongoosejs.com/docs/guide.html#definition */
/* https://stackoverflow.com/questions/43534461/array-of-subdocuments-in-mongoose */ 

/* Create a course schema - US5 */


const universitySchema = new mongoose.Schema({
    name: String,
    colleges: [collegeSchema],
    requirements: [courseSchema],
    emailDomain: String,
    users: [userSchema]
});

module.exports = mongoose.model('University', universitySchema);


