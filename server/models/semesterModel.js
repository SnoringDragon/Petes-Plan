const mongoose = require('mongoose');


const semesterSchema = new mongoose.Schema({
    semester: ['Spring', 'Summer', 'Fall'],
    sections: [Section],
});

module.exports = mongoose.model('Semester', semesterSchema);