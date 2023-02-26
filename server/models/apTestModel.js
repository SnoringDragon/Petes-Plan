const mongoose = require('mongoose');

const apTestSchema = new mongoose.Schema({
    name: String,
    credits: [Number][String], //2D array: [score][courses cleared]
    courseID: String
});

module.exports = mongoose.model('APTest', apTestSchema);