const mongoose = require('mongoose');

async function saveReviews(in_email, in_dateSubmitted, in_courseSubject, in_courseID, instructor_fname, instructor_lname, in_wouldTakeAgain, rating, comment, in_grade) {
    let instructor_ret = await Instructor.findOne({ firstname: instructor_fname, lastname: instructor_lname });
    let user = await User.findOne({ email: in_email}); //don't need this yet, but maybe in the future?
    let course_ret = await Course.findOne({ subject: in_courseSubject, courseId: in_courseID});
    let review = await degreeModel.create({ dateSubmitted : in_dateSubmitted, instructor: instructor_ret, course: course_ret, quality: rating, review: comment,  wouldTakeAgain: in_wouldTakeAgain, grade: in_grade});
}

//ret type: 2D array
async function getReviewsByProfessor(instructor_fname, instructor_lname) {
    let instructor_ret = await Instructor.findOne({ firstname: instructor_fname, lastname: instructor_lname });
    let reviews = await ratingModel.find({ instructor: instructor_ret});
    reviews = res.json(reviews);
    //process reviews
    let ret_reviews = []
    for (let i = 0; i < reviews.length; i ++) {
        let ret_review = []
        ret_review.push(reviews[i].dateSubmitted)
        ret_review.push(reviews[i].course.subject + " " + reviews[i].course.courseId);
        ret_review.push(instructor_fname);
        ret_review.push(instructor_lname);
    }
    let retArray = [reviews]
}

async function getReviewsByCourse(in_courseSubject, in_courseID) {

}