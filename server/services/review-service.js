const mongoose = require('mongoose');
const {Rating} = require('../models/ratingModel');
const User = require('../models/userModel');
const Instructor = require('../models/instructorModel');
const Course = require('../models/courseModel');

async function saveReview(in_email, in_dateSubmitted, in_courseSubject, in_courseID, instructor_fname, instructor_lname, in_wouldTakeAgain, rating, comment, in_grade) {
    let instructor_ret = await Instructor.findOne({ firstname: instructor_fname, lastname: instructor_lname });
    let user = await User.findOne({ email: in_email}); //don't need this yet, but maybe in the future?
    let course_ret = await Course.findOne({ subject: in_courseSubject, courseId: in_courseID});
    let review = await Rating.create({ dateSubmitted : in_dateSubmitted, instructor: instructor_ret, course: course_ret, quality: rating, review: comment,  wouldTakeAgain: in_wouldTakeAgain, grade: in_grade});
}

//ret type: 2D array
async function getReviewsByProfessor(instructor_fname, instructor_lname) {
    let instructor_ret = await Instructor.findOne({ firstname: instructor_fname, lastname: instructor_lname });
    let reviews = await ratingModel.find({ instructor: instructor_ret});
    reviews = res.json(reviews);
    //process reviews
    let ret_reviews = "{ \"reviews\" : [";
    for (let i = 0; i < reviews.length; i++) {
        ret_reviews += JSON.stringify(reviews[i]);
        ret_reviews += ","
    }
    ret_reviews+="]}"
    return ret_reviews;
}

async function getReviewsByCourse(in_courseSubject, in_courseID) {
    let course_ret = await course.findOne({ subject: in_courseSubject, courseId: in_courseID });
    let reviews = await ratingModel.find({ course: course_ret});
    reviews = res.json(reviews);
    //process reviews
    let ret_reviews = "{ \"reviews\" : [";
    for (let i = 0; i < reviews.length; i++) {
        ret_reviews += JSON.stringify(reviews[i]);
        ret_reviews += ","
    }
    ret_reviews+="]}"
    return ret_reviews;
}

module.exports = saveReviews, getReviewsByProfessor, getReviewsByCourse;
