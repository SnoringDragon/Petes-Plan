const mongoose = require('mongoose');


const semesterSchema = new mongoose.Schema({
    semester: ['Spring', 'Summer', 'Fall'],
    sections: [Number], //list of crns
    year: Number
});

module.exports = mongoose.model('Semester', semesterSchema);