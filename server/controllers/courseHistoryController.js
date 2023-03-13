const UserCourse = require('../models/userCourseModel');
const User = require('../models/userModel');

const isValidGrade = grade => /^(?:[A-D][-+]?|[EFPNSIWU]|(?:PI|PO|IN|WN|IX|WF|SI|IU|WU|AU|CR|NS))$/.test(grade)

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
        if (!course || !course.courseID || !course.subject || !course.semester || !course.year) {
            return res.status(400).json({
                message: 'Missing courseID, subject, semester, or year',
                course: course
            });
        }

        /* Validate grade is valid https://www.purdue.edu/registrar/faculty/grading/grading-systems.html */
        if (course.grade && !isValidGrade(course.grade)) {
            return res.status(400).json({
                message: 'Grade invalid',
                course: course
            });
        }

        /* Validate section is a number */
        // if (course.section && isNaN(course.section)) {
        //     return res.status(400).json({
        //         message: 'Section must be a number',
        //         course: course
        //     });
        // } else course.section = null;

        /* Validate year is valid */
        if (isNaN(course.year)) {
            return res.status(400).json({
                message: 'Year must be a number',
                course: course
            });
        }

        /* Validate semester is valid */
        if (course.semester !== 'Fall' && course.semester !== 'Spring' && course.semester !== 'Summer') {
            return res.status(400).json({
                message: 'Semester must be Fall, Spring, or Summer',
                course: course
            });
        }

        /* Validate year is no greater than current year */
        var date = new Date();
        date.setDate(date.getDate() + 1);
        if (course.year > date.getFullYear()) {
            return res.status(400).json({
                message: 'Year cannot be greater than current year',
                course: course
            });
        }

        /* Validate semester is no greater than current semester */
        if (course.year === date.getFullYear()) {
            if ((course.semester === 'Fall' && date.getMonth() < 8)
                    || (course.semester === 'Spring' && date.getMonth() < 1)
                    || (course.semester === 'Summer' && date.getMonth() < 5)) {
                return res.status(400).json({
                    message: 'Semester cannot be greater than current semester',
                    course: course
                });
            }
        }

        /* Add the course to the user's current degree plan */
        user.completedCourses.push({
            courseID: course.courseID,
            semester: course.semester,
            year: course.year,
            grade: course.grade,
            // section: course.section,
            subject: course.subject
        });
    }

    /* Save the user to the database */
    user.save().then(() => {
        return res.status(201).json({
            message: 'Course added to current degree plan'
        });
    }).catch((err) => {
        console.log(err.message);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
};

/* Modify a course in the user's current degree plan */
exports.modifyCourse = async (req, res) => {
    const user = req.user;
    const courses = req.body.courses;
    var updated = false;

    /* Check if courses are provided */
    if (!courses || !(courses instanceof Array) || courses.length === 0) {
        return res.status(400).json({
            message: 'Missing array of courses'
        });
    }

    /* Update each provided course */
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];

        /* Validate required fields present */
        if (!course || !course._id) {
            return res.status(400).json({
                message: `Missing course _id`,
                course: course
            });
        }

        /* Get corresponding course in user's current degree plan */
        const orgCourse = await user.completedCourses.id(course._id);

        /* Validate course exists in current degree plan */
        if (!orgCourse) {
            return res.status(400).json({
                message: `Invalid course _id`,
                course: course
            });
        }

        /* Validate grade is a new number */
        if ((typeof course.grade !== 'undefined') && (course.grade !== orgCourse.grade)) {
            if (!(isValidGrade(course.grade) || (course.grade === null))) {
                return res.status(400).json({
                    message: `Grade invalid`,
                    course: course
                });
            }
            orgCourse.grade = course.grade;
            updated = true;
        }

        /* Validate section is a new number */
        // if ((typeof course.section !== 'undefined') && (course.section !== orgCourse.section)) {
        //     if (isNaN(course.section)) {
        //         return res.status(400).json({
        //             message: `Section must be a number`,
        //             course: course
        //         });
        //     }
        //     orgCourse.section = course.section;
        //     updated = true;
        // }
    }

    /* Save the user to the database */
    if (updated) {
        user.save().then(() => {
            return res.status(200).json({
                message: 'Course(s) updated in current degree plan'
            });
        }).catch((err) => {
            console.log(err.message);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });
    } else {
        return res.status(200).json({
            message: 'No changes made to course(s)'
        });
    }
};

/* Delete a course from the user's current degree plan */
exports.deleteCourse = async (req, res) => {
    const user = req.user;
    const ids = req.body._ids;

    /* Check if courses are provided */
    if (!ids || !(ids instanceof Array) || ids.length === 0) {
        return res.status(400).json({
            message: 'Missing array of _ids'
        });
    }

    /* Remove each provided course */
    for (let i = 0; i < ids.length; i++) {
        const _id = ids[i];

        /* Get corresponding course in user's current degree plan */
        const course = await user.completedCourses.id(_id);

        /* Validate course exists in current degree plan */
        if (!course) {
            return res.status(400).json({
                message: 'Invalid course _id',
                _id: _id
            });
        }

        course.remove();
    }

    /* Save the user to the database */
    user.save().then(() => {
        return res.status(200).json({
            message: 'Course(s) removed from current degree plan'
        });
    }).catch((err) => {
        console.log(err.message);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
};