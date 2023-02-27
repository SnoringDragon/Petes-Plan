const userCourse = require('../models/userCourseModel');

/* Get all courses the user has previously taken */
exports.getCourses = async (req, res) => {
    const user = req.user;

    /* Return the user's completed courses */
    return res.status(200).json({
        courses: user.completedCourses
    });
};

/* Get all courses the user has previously taken that match the query */
exports.queryCourses = async (req, res) => {
    // TODO: Implement (optional)
    return res.status(501).json({
        error: 'Not Implemented'
    });
};

/* Add a course to the user's current degree plan */
exports.addCourse = async (req, res) => {
    const user = req.user;
    const courses = req.body.courses;

    /* Validate request */
    if (!courses || !(courses instanceof Array)) {
        return res.status(400).json({
            error: 'Missing array of courses'
        });
    }

    /* Add each course to the user's current degree plan */
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];

        /* Validate course */
        if (!course || !course.courseID || !course.semester || !course.year) {
            return res.status(400).json({
                error: `Course ${i}: Missing courseID, semester, or year`
            });
        }

        /* Add the course to the user's current degree plan */
        user.completedCourses.push(new userCourse({
            courseID: course.courseID,
            semester: course.semester,
            year: course.year,
            grade: course.grade,
            section: course.section
        }));

        /* Save the user to the database */
        user.save().then(() => {
            return res.status(200).json({
                message: 'Course added to current degree plan'
            });
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        });
    }
};

/* Modify a course in the user's current degree plan */
exports.modifyCourse = async (req, res) => {

};

/* Delete a course from the user's current degree plan */
exports.deleteCourse = async (req, res) => {

};