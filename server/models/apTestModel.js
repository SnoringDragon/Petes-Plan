const mongoose = require('mongoose');

const apTestSchema = new mongoose.Schema({
    name: { type: String, },
    type: { type: String, default: "ap" },
    credits: [{
        _id: false, // dont need id on sub schema
        score: String, 
        courses: [{
            _id: false, // dont need id on sub schema
            courseID: String,
            subject: String
        }],
    }]
});

apTestSchema.index({ type: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('APTest', apTestSchema);
