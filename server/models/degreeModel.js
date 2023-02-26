const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
    name: String,
    type: ['major', 'minor', 'concentration', 'certificate'],
    requirements: [String], //array of courseIDs
    concentrations: [degreeSchema]
});

module.exports = mongoose.model('Degree', degreeSchema);
