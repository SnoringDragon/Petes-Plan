const mongoose = require('mongoose');

//Includes schemas for: userCourse, semester, section, instructor

/* Resources: https://mongoosejs.com/docs/guide.html#definition */
/* https://stackoverflow.com/questions/43534461/array-of-subdocuments-in-mongoose */ 

/* Create a course schema - US5 */
const courseSchema = new mongoose.Schema({
    name: String,
    courseID: String,
    credits: Number,
    description: String,
    semesters: {
        type: [semesterSchema],  //TODO: declare semester type
        default: [{  //TODO: update below fields after Semester object made
            semester: "Spring",
            sections: "default answer"
        }]
    },
    prerequisites: {
        type: [courseSchema]
    }
});

const semesterSchema = new mongoose.Schema({
    semester: ['Spring', 'Summer', 'Fall'],
    sections: {
        type: [Section], 
        default: [{  //TODO: update below fields after Semester object made
            instructor: {
                type: Instructor
                //TODO: add Instructor type
            },
            days: "MWF",
            crn: 13396,
            name: "Empty",
            startTime: new Date(year = 0, month = 0, day = 0, hour = 1, minute = 30, 0, 0),
            endTime: new Date(year = 0, month = 0, day = 0, hour = 2, minute = 20, 0, 0),
            location: "SMTH 108",
            type: "Lecture"
        }]
    },
    prerequisites: {
        type: [courseSchema]
    }
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