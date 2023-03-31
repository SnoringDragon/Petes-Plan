const User = require('../models/userModel.js');
const Degree = require('../models/degreeModel.js');
const Course = require('../models/courseModel.js');
const Semester = require('../models/semesterModel');
const mongoose = require('mongoose');

/* Returns all degree plans for the user */
exports.getDegreePlans = async (req, res) => {
    let user = await req.user.populate('degreePlans.degrees');
    user = await user.populate('degreePlans.courses.section');
    user = await user.populate('degreePlans.courses.section.meetings.instructors');

    user = user.toObject();

    await Promise.all(user.degreePlans.map(async (plan, i) => {
        await Promise.all(plan.courses.map(async (course, j) => {
            const [courseModel, semester] = await Promise.all([
                Course.findOne({ courseID: course.courseID, subject: course.subject }),
                Semester.findOne({ semester: course.semester, year: course.year })
            ]);

            if (courseModel)
                user.degreePlans[i].courses[j].courseData = courseModel.toObject();

            if (courseModel && semester) {
                const sections = await courseModel.getSections(semester);
                user.degreePlans[i].courses[j].courseData.sections = sections;
            }
        }));
    }))

    return res.status(200).json({
        message: 'Successfully retrieved degree plans',
        degreePlans: user.degreePlans
    });
};

/* Creates a new degree plan */
exports.addDegreePlan = async (req, res) => {
    /* Validate degree plan name is not empty */
    if (!req.body.name) {
        return res.status(400).json({
            message: 'Degree plan must have a name'
        });
    }

    /* Validate degree plan name is unique */
    for (let i = 0; i < req.user.degreePlans.length; i++) {
        if (req.user.degreePlans[i].name === req.body.name) {
            return res.status(400).json({
                message: 'Degree plan name already in use',
                name: req.body.name
            });
        }
    }

    /* Add degree plan to user */
    req.user.degreePlans.push({
        name: req.body.name,
    });

    /* Save the user to the database */
    req.user.save().then(() => {
        return res.status(201).json({
            message: 'Successfully created new degree plan',
            degreePlan: req.user.degreePlans[req.user.degreePlans.length - 1]
        });
    }).catch((err) => {
        console.log(err.message);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
};

/* Deletes existing degree plan(s) */
exports.deleteDegreePlan = async (req, res) => {
    const _ids = req.body._ids;

    /* Check if degree plan _ids are provided */
    if (!_ids || !(_ids instanceof Array) || _ids.length === 0) {
        return res.status(400).json({
            message: 'Missing array of _ids'
        });
    }

    /* Attempt to find and remove degree plan(s) */
    for (let i = 0; i < _ids.length; i++) {
        const degreePlan = req.user.degreePlans.id(_ids[i]);

        if (!degreePlan) {
            return res.status(400).json({
                message: 'Invalid degree plan _id',
                _id: _ids[i]
            });
        }

        degreePlan.remove();
    }

    /* Save the user to the database */
    req.user.save().then(() => {
        return res.status(200).json({
            message: 'Successfully deleted degree plan(s)'
        });
    }).catch((err) => {
        console.log(err.message);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
};

/* Adds courses to a degree plan */
exports.addCourse = async (req, res) => {
    /* Check if degree plan _id is valid */
    const subdir = req.path.split('/');
    const degreePlan = req.user.degreePlans.id(subdir[1]);
    if (!degreePlan) {
        return res.status(400).json({
            message: 'Invalid degree plan _id',
            _id: subdir[1]
        });
    }

    /* Check if courses and/or degrees are provided */
    const courses = req.body.courses;
    const degrees = req.body.degrees;
    if (!courses && !degrees) {
        return res.status(400).json({
            message: 'Missing courses or degrees'
        });
    }

    /* Add Courses */
    if (courses) {
        /* Check if courses is a valid array */
        if (!(courses instanceof Array)) {
            return res.status(400).json({
                message: 'Courses must be an array'
            });
        }

        /* Add each course */
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];

            /* Check if course is valid */
            if (!course.courseID || !course.semester || !course.year || !course.subject) {
                return res.status(400).json({
                    message: 'Course must contain courseID, semester, subject, and year',
                    course: course
                });
            }

            if (course.section) {
                try {
                    mongoose.Types.ObjectId(course.section)
                } catch {
                    return res.status(400).json({ message: 'invalid section id' });
                }
            }

            /* Check if semester is valid */
            if (course.semester !== 'Spring' && course.semester !== 'Summer' && course.semester !== 'Fall') {
                return res.status(400).json({
                    message: 'Invalid semester, must be Spring, Summer, or Fall',
                    course: course
                });
            }

            /* Check if year is number */
            var date = new Date();
            if (isNaN(course.year)) {
                return res.status(400).json({
                    message: 'Invalid year, must be a number',
                    course: course
                });
            }

            /* Check if courseID is valid */
            // const courseIDParts = course.courseID.split(' ');
            // if (courseIDParts.length !== 2) {
            //     return res.status(400).json({
            //         message: 'Invalid courseID, must be in the form of "CS 1234"',
            //         course: course
            //     });
            // }

            /* Check if course is in database */
            const coursematches = await Course.find({ subject: course.subject, courseID: course.courseID });
            if (coursematches.length === 0) {
                return res.status(400).json({
                    message: 'Course does not exist',
                    course: course
                });
            }

            /* Check if course is already in degree plan */
            for (let j = 0; j < degreePlan.courses.length; j++) {
                if (degreePlan.courses[j]._id.equals(course._id)) {
                    return res.status(400).json({
                        message: 'Course already in degree plan',
                        course: course
                    });
                }
            }

            /* Add course to degree plan */
            degreePlan.courses.push({
                courseID: course.courseID,
                semester: course.semester,
                year: course.year,
                subject: course.subject,
                section: course.section
            });
        }
    }

    /* Add Degrees */
    if (degrees) {
        /* Check if degrees is a valid array */
        if (!(degrees instanceof Array)) {
            return res.status(400).json({
                message: 'Degrees must be an array'
            });
        }

        /* Add each degree */
        for (let i = 0; i < degrees.length; i++) {
            const degree = degrees[i];

            let docs;
            if (degree?._id) {
                docs = [await Degree.findOne({ _id: degree?._id })];
            } else {

                /* Check if degree is valid */
                if (!degree.name || !degree.type) {
                    return res.status(400).json({
                        message: 'Degree must contain name and type',
                        degree: degree
                    });
                }

                /* Check if type is valid */
                if (degree.type !== 'major' && degree.type !== 'minor'
                    && degree.type !== 'concentration' && degree.type !== 'certificate') {
                    return res.status(400).json({
                        message: 'Invalid type, must be major, minor, concentration, or certificate',
                        degree: degree
                    });
                }

                /* Check if degree exists */
                docs = await Degree.find({name: degree.name, type: degree.type});
            }
            if (docs.length === 0) {
                return res.status(400).json({
                    message: 'Degree does not exist',
                    degree: degree
                });
            } else if (docs.length > 1) {
                console.log("Multiplle degrees share courseID:\n" + docs);
                return res.status(500).json({
                    message: 'Internal Server Error, too many degrees with same name and type',
                    degree: degree
                });
            }

            /* Check if degree is already in degree plan */
            for (let j = 0; j < degreePlan.degrees.length; j++) {
                if (degreePlan.degrees[j]._id.equals(docs[0]._id)) {
                    return res.status(400).json({
                        message: 'Degree already in degree plan',
                        degree: degree
                    });
                }
            }

            /* Add degree to degree plan */
            degreePlan.degrees.push(docs[0]._id);
        }
    }

    /* Save the user to the database */
    await req.user.populateAll();
    req.user.save().then(() => {
        return res.status(201).json({
            message: 'Successfully added degree(s)/course(s) to degree plan',
            degreePlan: degreePlan
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
};

/* Removes courses from a degree plan */
exports.removeCourse = async (req, res) => {
    /* Check if degree plan _id is valid */
    const subdir = req.path.split('/');
    const degreePlan = req.user.degreePlans.id(subdir[1]);
    if (!degreePlan) {
        return res.status(400).json({
            message: 'Invalid degree plan _id',
            _id: subdir[1]
        });
    }

    /* Check if courses and/or degrees are provided */
    const courses = req.body.courses;
    const degrees = req.body.degrees;
    if (!courses && !degrees) {
        return res.status(400).json({
            message: 'Missing courses or degrees'
        });
    }

    /* Check if courses is a valid array */
    if (courses && !(courses instanceof Array)) {
        return res.status(400).json({
            message: 'Courses must be an array'
        });
    }

    /* Check if degrees is a valid array */
    if (degrees && !(degrees instanceof Array)) {
        return res.status(400).json({
            message: 'Degrees must be an array'
        });
    }

    /* Remove Courses */
    if (courses) {
        /* Remove each course */
        for (let i = 0; i < courses.length; i++) {
            const _id = courses[i];

            /* Check if course in degree plan */
            var found = false;
            for (let j = 0; j < degreePlan.courses.length; j++) {
                if (degreePlan.courses[j]._id.equals(_id)) {
                    degreePlan.courses.splice(j, 1);
                    found = true;
                    break;
                }
            }

            /* Check if course was found */
            if (!found) {
                return res.status(400).json({
                    message: 'Course not in degree plan',
                    _id: _id
                });
            }
        }
    }

    /* Remove Degrees */
    if (degrees) {
        /* Remove each degree */
        for (let i = 0; i < degrees.length; i++) {
            const _id = degrees[i];

            /* Check if degree in degree plan */
            var found = false;
            for (let j = 0; j < degreePlan.degrees.length; j++) {
                if (degreePlan.degrees[j]._id.equals(_id)) {
                    degreePlan.degrees.splice(j, 1);
                    found = true;
                    break;
                }
            }

            /* Check if degree was found */
            if (!found) {
                return res.status(400).json({
                    message: 'Degree not in degree plan',
                    _id: _id
                });
            }
        }
    }

    /* Save the user to the database */
    await req.user.populateAll();
    req.user.save().then(() => {
        return res.status(200).json({
            message: 'Successfully removed course(s)/degree(s) from degree plan',
            degreePlan: degreePlan
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
};

/* Returns data for a degree plan */
exports.getDegreePlan = async (req, res) => {
    /* Check if path is valid */
    const subdir = req.path.split('/');
    if (subdir.length !== 2) {
        return res.status(404).json({
            message: 'Invalid Path'
        });
    }

    /* Check if degree plan _id is valid */
    const degreePlan = req.user.degreePlans.id(subdir[1]);
    if (!degreePlan) {
        return res.status(400).json({
            message: 'Invalid degree plan _id',
            _id: subdir[1]
        });
    }

    /* Return degree plan data */
    return res.status(200).json({
        message: 'Successfully retrieved degree plan',
        degreePlan: degreePlan
    });
};

/* Calculates the total requirements for a degree plan */
exports.getGradReqs = async (req, res) => {
    /* Check if path is valid */
    const subdir = req.path.split('/');
    if (subdir.length !== 3) {
        return res.status(404).json({
            message: 'Invalid Path'
        });
    }

    /* Check if degree plan _id is valid */
    const user = await req.user.populate('degreePlans.degrees');
    var degreePlan;
    try {
        degreePlan = req.user.degreePlans.id(subdir[1]);
    } catch (err) { degreePlan = null; }
    if (!degreePlan) {
        return res.status(400).json({
            message: 'Invalid degree plan _id',
            _id: subdir[1]
        });
    }

    /* Iterate through degrees and add requirements */
    var gradReqs = new Map();
    for (let i = 0; i < degreePlan.degrees.length; i++) {
        const degree = degreePlan.degrees[i];
        for (let j = 0; j < degree.requirements.length; j++) {
            gradReqs.set(degree.requirements[j], false);
        }
    }

    /* Iterate through requirements and add to array */
    var gradReqsArr = [];
    gradReqs.forEach((value, key) => {
        gradReqsArr.push(key);
    });

    /* Return total degree requirements */
    return res.status(200).json({
        message: 'Successfully retrieved degree requirements',
        gradReqs: gradReqsArr
    });
};

/* Calculate the intersection of requiremtns between one degree and a degree plan */
exports.getReqIntersection = async (req, res) => {
    /* Check if path is valid */
    const subdir = req.path.split('/');
    if (subdir.length !== 4) {
        return res.status(404).json({
            message: 'Invalid Path'
        });
    }

    /* Check if degree plan _id is valid */
    const user = await req.user.populate('degreePlans.degrees');
    var degreePlan;
    try {
        degreePlan = req.user.degreePlans.id(subdir[1]);
    } catch (err) { degreePlan = null; }
    if (!degreePlan) {
        return res.status(400).json({
            message: 'Invalid degree plan _id',
            _id: subdir[1]
        });
    }

    /* Check if degree _id is present */
    if (!subdir[3]) {
        return res.status(400).json({
            message: 'Missing degree _id'
        });
    }

    /* Check if degree _id is valid */
    var compDegree;
    try {
        compDegree = await Degree.findById(subdir[3]);
    } catch (err) { compDegree = null; }
    if (!compDegree) {
        return res.status(400).json({
            message: 'Invalid degree _id',
            _id: req.body._id
        });
    }

    /* Iterate through degrees and add requirements */
    var gradReqs = new Map();
    for (let i = 0; i < degreePlan.degrees.length; i++) {
        const degree = degreePlan.degrees[i];
        for (let j = 0; j < degree.requirements.length; j++) {
            gradReqs.set(degree.requirements[j].toString(), false);
        }
    }

    /* Iterate through selected degree requirements and add to array if in map */
    var gradReqsArr = [];
    for (let i = 0; i < compDegree.requirements.length; i++) {
        const req = compDegree.requirements[i];
        if (gradReqs.has(req.toString())) {
            gradReqsArr.push(req);
        }
    }

    /* Return intersection of requirements */
    return res.status(200).json({
        message: 'Successfully retrieved requirements intersection',
        reqs: gradReqsArr
    });
};