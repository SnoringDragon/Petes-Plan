const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    email: String, //userId
    dateSubmitted: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, //could link course page if on instructor reviews
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' }, //and vice versa
    attendanceReq: Boolean,
    rating: Number,
    comment: String,
    grade: String
});

module.exports = mongoose.model('Review', reviewSchema);
