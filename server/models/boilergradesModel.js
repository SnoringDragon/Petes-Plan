const mongoose = require('mongoose');

const boilergradesSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
    grades: Array,
    gpa: [[Number]]
});

boilergradesSchema.index({
    section: 1,
    instructor: 1,
}, {
    background: false,
    unique: true
});

boilergradesSchema.index({
    course: 'hashed'
});

boilergradesSchema.index({
    instructor: 'hashed'
});

module.exports = mongoose.model('Boilergrades', boilergradesSchema);
