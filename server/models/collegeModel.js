const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: String,
    departments: [String], //array of dept names
    requirements: [String] //array of courseIDs
});

module.exports = mongoose.model('College', collegeSchema);
