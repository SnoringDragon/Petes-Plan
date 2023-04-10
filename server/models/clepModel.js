const mongoose = require('mongoose');

const clepSchema = new mongoose.Schema({
    name: { type: String, unique: true }, //ex. Algebra, College
    credits: [{
        _id: false, 
        score: Number,  //ex. 70
        courses: [{
            _id: false, 
            courseID: String,   //ex. 11000, 11100
            subject: String     //ex. BIO
        }],
    }]
});

module.exports = mongoose.model('CLEP', clepSchema);
