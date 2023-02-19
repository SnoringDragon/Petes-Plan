const mongoose = require('mongoose');

/* Resources: https://mongoosejs.com/docs/guide.html#definition */
/* https://stackoverflow.com/questions/43534461/array-of-subdocuments-in-mongoose */ 
/* Create a course schema - US5 */
const courseSchema = new mongoose.Schema({
    name: String,
    courseID: String,
    credits: Number,
    description: String,
    semesters: {
        type: [Semester],  //TODO: declare semester type
        default: [{  //TODO: update below fields after Semester object made
            semester: "Spring",
            sections: "default answer"
        }]
    },
    prerequisites: {
        type: [courseSchema]
    }
});