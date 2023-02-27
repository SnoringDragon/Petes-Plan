const userCourse = require('../models/userCourseModel');

/* Get all courses the user has previously taken */
exports.getCourses = async (req, res) => {
    const user = req.user;

    /* Return the user's completed courses */
    return res.status(200).json({
        message: 'Successfully retrieved completed courses',
        courses: user.completedCourses
    });
};

/* Get all courses the user has previously taken that match the query */
exports.queryCourses = async (req, res) => {
    // TODO: Implement (optional)
    return res.status(501).json({
        message: 'Not Implemented'
    });
};

/* Add a course to the user's current degree plan */
exports.addCourse = async (req, res) => {
    const user = req.user;
    const courses = req.body.courses;

    /* Check if courses are provided */
    if (!courses || !(courses instanceof Array) || courses.length === 0) {
        return res.status(400).json({
            message: 'Missing array of courses'
        });
    }

    /* Add each course to the user's current degree plan */
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];

        /* Validate required fields present */
        if (!course || !course.courseID || !course.semester || !course.year) {
            return res.status(400).json({
                message: `Missing courseID, semester, or year`,
                course: course
            });
        }

        /* Validate grade is a number */
        if (course.grade && isNaN(course.grade)) {
            return res.status(400).json({
                message: `Grade must be a number`,
                course: course
            });
        }

        /* Validate section is a number */
        if (course.section && isNaN(course.section)) {
            return res.status(400).json({
                message: `Section must be a number`,
                course: course
            });
        }

        /* Validate semester is valid */
        if (isNaN(course.year)) {
            return res.status(400).json({
                message: `Year must be a number`,
                course: course
            });
        }

        /* Validate year is no greater than current year */
        var date = new Date();
        date.setDate(date.getDate() + 1);
        if (course.year > date.getFullYear()) {
            return res.status(400).json({
                message: `Year cannot be greater than current year`,
                course: course
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
    }

    /* Save the user to the database */
    user.save().then(() => {
        return res.status(201).json({
            message: 'Course added to current degree plan'
        });
    }).catch((err) => {
        /* Handle validation errors from invalid input */
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'V' + err.message.substring(6, err.message.length)
            });
        }

        /* Handle other errors */
        console.log(err.message);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
};

/* Modify a course in the user's current degree plan */
exports.modifyCourse = async (req, res) => {

};

/* Delete a course from the user's current degree plan */
exports.deleteCourse = async (req, res) => {

};