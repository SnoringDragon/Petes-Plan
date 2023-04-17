const mongoose = require('mongoose');

async function saveReviews(in_email, dateSubmitted, in_courseSubject, in_courseID, instructor_fname, instructor_lname, in_wouldTakeAgain, rating, comment, in_grade) {
    let instructor_ret = await Instructor.findOne({ firstname: instructor_fname, lastname: instructor_lname });
    let user = await User.findOne({ email: in_email}); //don't need this yet, but maybe in the future?
    let course_ret = await Course.findOne({ subject: in_courseSubject, courseId: in_courseID});
    let review = await degreeModel.create({ instructor: instructor_ret, course: course_ret, quality: rating, review: comment,  wouldTakeAgain: in_wouldTakeAgain, grade: in_grade});
}

async function getReviewsByProfessor(instructor_fname, instructor_lname) {
    
}

async function getReviewsByCourse(in_courseSubject, in_courseID) {

}