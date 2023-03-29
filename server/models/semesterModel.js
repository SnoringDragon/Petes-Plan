const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
    term: String,
    semester: {
        type: String,
        enum: ['Spring', 'Fall', 'Winter', 'Summer']
    },
    year: Number
});

module.exports = mongoose.model('Semester', semesterSchema);
