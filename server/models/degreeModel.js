const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
    name: String,
    type: {
        type: String,
        enum: ['major', 'minor', 'concentration', 'certificate']
    },
    requirements: [{ courseID: String,
                     subject: String, 
                     _id: false }], //array of courses
    concentrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Degree' }]
});

module.exports = mongoose.model('Degree', degreeSchema);
