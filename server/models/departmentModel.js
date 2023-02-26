const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: String,
    degrees: [degreeSchema],
    requirements: [courseSchema]
})

module.exports = mongoose.model('Department', departmentSchema);
