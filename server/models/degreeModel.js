const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
    name: String,
    type: {
        type: String,
        enum: ['major', 'minor', 'concentration', 'certificate']
    },
    requirements: [String], //array of courseIDs
    concentrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Degree' }]
});

module.exports = mongoose.model('Degree', degreeSchema);
