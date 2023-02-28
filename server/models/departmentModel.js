const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: String,
    degrees: [degreeSchema],
    requirements: [String], //array of courseIDs
})

module.exports = mongoose.model('Department', departmentSchema);
