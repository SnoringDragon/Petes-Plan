const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
    name: String,
    type: ['major', 'minor', 'concentration', 'certificate'],
    requirements: [courseSchema],
    concentrations: [degreeSchema]
});

module.exports = mongoose.model('Degree', degreeSchema);
