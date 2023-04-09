const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
    name: String,

    type: {
        type: String,
        enum: ['major', 'minor', 'concentration', 'certificate']
    },

    info: String,
    link: String,

    requirements: Object,
    requiredCredits: Number,

    concentrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Degree' }]
});

degreeSchema.index({ name: 1 }, {
    unique: true
});

module.exports = mongoose.model('Degree', degreeSchema);
