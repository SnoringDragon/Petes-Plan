const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
    name: String,
    type: {
        type: String,
        enum: ['major', 'minor', 'concentration', 'certificate']
    },
    requirements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' } ], //array of courses
    concentrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Degree' }]
});

module.exports = mongoose.model('Degree', degreeSchema);
