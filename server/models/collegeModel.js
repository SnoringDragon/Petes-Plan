const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: String,
    departments: [departmentSchema],
    requirements: [courseSchema]
});

module.exports = mongoose.model('College', collegeSchema);
