const User = require('../models/userModel.js');
const Degree = require('../models/degreeModel.js');
const Course = require('../models/courseModel.js');
const Semester = require('../models/semesterModel');
const UserCourse = require('../models/userCourseModel');
const mongoose = require('mongoose');

const grades = {
    'A+': 15,
    'A': 14,
    'A-': 13,
    'B+': 12,
    'B': 11,
    'B-': 10,
    'C+': 9,
    'C': 8,
    'C-': 7,
    'P': 6,
    'D+': 5,
    'D': 4,
    'D-': 3,
    'F': 2,
    'N': 1,
    'NP': 1
}

const semesters = {
    'Spring': 1,
    'Summer': 2,
    'Fall': 3,
    'Winter': 4
}

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
        const reqs = degree.getCourses();
        for (let j = 0; j < reqs.length; j++) {
            gradReqs.set(reqs[j].subject + reqs[j].courseID, false);
        }
    }

    /* Iterate through selected degree requirements and add to array if in map */
    var gradReqsArr = [];
    const reqs = compDegree.getCourses();
    for (let i = 0; i < reqs.length; i++) {
        const req = reqs[i];
        if (gradReqs.has(req.subject + req.courseID)) {
            gradReqsArr.push(req);
        }
    }

    /* Return intersection of requirements */
    return res.status(200).json({
        message: 'Successfully retrieved requirements intersection',
        reqs: gradReqsArr
    });
};

/* Returns ordered list of recommended courses for a degree plan */
exports.getRecommendedCourses = async (req, res) => {
    /**************  Check provided values - BEGIN  **************/
    
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

    /**************  Check provided values - END  **************/
    /**************  Get passed requirements - BEGIN  **************/

    //TODO: Ignore overridden requirements

    /* Add test scores to tests map */
    var tests = new Map();
    await user.populate('apTests.test');
    for (const test of user.apTests) {
        if (!tests.has(test.test._id)) {
            tests.set(test.test._id, test);
        } else if (test.score > tests.get(test.test._id).score) {
            tests.set(test.test._id, test);
        }
    }

    /* Add test credits to credits map */
    var credits = new Map();
    for (const entry of tests.entries()) {
        const key = entry[0];
        const value = entry[1];

        for (const credit in value.test.credits) {
            if (credit.score != value.score) continue;

            const course = Course.findOne({ subject: credit.subject, courseID: credit.courseID });
            if (!course) {
                console.log('ERROR: Course not found\nSubject: ' + credit.subject + '\nCourse ID: ' + credit.courseID);
                continue;
            }

            credits.set(course._id, new UserCourse({
                courseData: course,
                grade: 'A+',
                courseID: course.courseID,
                subject: course.subject
            }));
        }
    }

    /* Add course history to credits map */
    await user.populate('completedCourses.courseData');
    for (const course of user.completedCourses) {
        if (!credits.has(course.courseData._id)) {
            credits.set(course.courseData._id, course);
        } else if (grades[course.grade] > grades[credits.get(course.courseData._id).grade]) {
            credits.set(course.courseData._id, course);
        }
    }

    /**************  Get passed requirements - END  **************/
    /**************  Get Requirements - Planned Courses - BEGIN  **************/

    /* Create map of planned courses for easy searching */
    var plannedCourses = new Map();
    for (const course of degreePlan.courses) {
        courseData = await Course.findOne({ subject: course.subject, courseID: course.courseID });
        if (!plannedCourses.has(courseData._id)) {
            plannedCourses.set(courseData._id, course);
        }
    }

    /* Add planned courses with unmet requirements to requirements map */
    var prereqs = new Map();
    for (const course of degreePlan.courses) {
        const courseData = await Course.findOne({ subject: course.subject, courseID: course.courseID });
        if (!courseData) {
            console.log('ERROR: Course not found\nSubject: ' + course.subject + '\nCourse ID: ' + course.courseID);
            continue;
        }

        /* Check if course requirements met */
        if (!courseData.requirements) continue;
        const reqs = await meetsReqs(credits, plannedCourses, course.semester, course.year, courseData.requirements);
        /* Add requirements to map */
        if (reqs.success || !reqs.reqs) continue;
        for (const entry of reqs.reqs.entries()) {
            const key = entry[0];
            const value = entry[1];
            if (prereqs.has(key)) prereqs.set(key, prereqs.get(key) + value);
            else prereqs.set(key, value);
        }
    }

    /**************  Get Requirements - Planned Courses - END  **************/
    /**************  Get Requirements - Planned Degrees - BEGIN  **************/

    /* Add unmet requirements from degrees to requirements map */
    var degreeReqs = new Map();
    user.populate('degreePlans.degrees');
    
    //TODO: Uncomment when degree requirements are added
    //for (const degree of degreePlan.degrees) {
    //    /* Check if degree requirements met */
    //    if (!degreeData.requirements) continue;
    //    const reqs = await meetsReqs(credits, plannedCourses, null, null, degreeData.requirements);
    //    /* Add requirements to map */
    //    if (reqs.success || !reqs.reqs) continue;
    //    for (const entry of reqs.reqs.entries()) {
    //        const key = entry[0];
    //        const value = entry[1];
    //        if (prereqs.has(key)) continue; // Ignore duplicate requirements
    //        if (degreeReqs.has(key)) degreeReqs.set(key, degreeReqs.get(key) + value);
    //        else degreeReqs.set(key, value);
    //    }
    //}

    /**************  Get Requirements - Planned Degrees - END  **************/
    /**************  Sort Requirements for Recommendations - BEGIN  **************/

    /* Convert prereqs map to array */
    var prereqsArr = [];
    for (const entry of prereqs.entries()) {
        prereqsArr.push({ course: JSON.parse(entry[0]), count: entry[1] });
    }
    prereqsArr.sort(compReqs);

    /* Convert degreeReqs map to array */
    var degreeReqsArr = [];
    for (const entry of degreeReqs.entries()) {
        degreeReqsArr.push({ course: JSON.parse(entry[0]), count: entry[1] });
    }
    degreeReqsArr.sort(compReqs);

    /* Combine prereqs and degreeReqs arrays and remove excess info */
    var tempreqs = prereqsArr.concat(degreeReqsArr);
    var reqs = [];
    for (const req of tempreqs) reqs.push(req.course);

    /**************  Sort Requirements for Recommendations - END  **************/

    /* Return recommended courses */
    return res.status(200).json({
        message: 'Successfully generated recommended courses',
        recommendations: reqs
    });
};

/* Recursively check course requirements */
async function meetsReqs(credits, plannedCourses, semester, year, container) {
    var reqs = new Map();

    /* Check if course requirement met */
    if (container.type === 'course') { 
        /* Get course data */
        const course = await Course.findOne({ subject: container.subject, courseID: container.courseID });
        if (!course) {
            console.log('ERROR: Course not found\nSubject: ' + container.subject + '\nCourse ID: ' + container.courseID);
            return {success: 0};
        }

        /* Check if course has been taken and meets minimum grade */
        if (credits.has(course._id) && (grades[credits.get(course._id).grade] > grades[container.minGrade])) return {success: 1};
        
        /* Check if course is planned and scheduled before course requiring it */
        if (plannedCourses.has(course._id)) {
            // Semester irrelevant if for degree
            if (!semester) return {success: 1};

            // Get semester object
            const plannedCourse = plannedCourses.get(course._id);
            
            // Check if course is scheduled before course requiring it
            if (plannedCourse.year < year) return {success: 1};
            if (plannedCourse.year == year) {
                if (semesters[plannedCourse.semester] < semesters[semester]) return {success: 1};
                if (plannedCourse.isCorequisite && (semesters[plannedCourse.semester] == semesters[semester])) return {success: 1};
            }
        }

        reqs.set(JSON.stringify({
            _id: course._id,
            courseID: course.courseID,
            subject: course.subject
        }), 1);
        return {success: 0, reqs: reqs};
    }
    
    /* Check if all child requirements have been met */
    /* If not, collect list of unmet requirements */
    if (container.type === 'and') {
        for (const child of container.children) {
            const childReqs = await meetsReqs(credits, plannedCourses, semester, year, child);
            if (childReqs.success || !childReqs.reqs) continue;
            
            /* Combine child requirements with parent requirements */
            for (const entry of childReqs.reqs.entries()) {
                const key = entry[0];
                const value = entry[1];
                if (reqs.has(key)) reqs.set(key, reqs.get(key) + value);
                else reqs.set(key, value);
            }
        }

        /* Check if all child requirements have been met */
        if (reqs.size == 0) return {success: 1};
        else return {success: 0, reqs: reqs};
    }
    
    /* Check if any child requirements have been met */
    /* If not, collect list of unmet requirements */
    if (container.type === 'or') {
        for (const child of container.children) {
            const childReqs = await meetsReqs(credits, plannedCourses, semester, year, child);
            if (childReqs.success) return {success: 1};
            else if (!childReqs.reqs) continue;

            /* Combine child requirements with parent requirements */
            for (const entry of childReqs.reqs.entries()) {
                const key = entry[0];
                const value = entry[1];
                if (reqs.has(key)) reqs.set(key, reqs.get(key) + value);
                else reqs.set(key, value);
            }
        }
        return {success: 0, reqs: reqs};
    }
    
    console.log('ERROR: Unknown container type: ' + container.type);
    return {success: 0};
}

/* Requirement comparison function */
function compReqs(a, b) {
    // Sort by number of references
    if (a.count < b.count) return 1;
    if (a.count > b.count) return -1;
    
    // Subsort by courseID
    var compID = a.course.courseID.localeCompare(b.course.courseID);
    if (compID != 0) return compID;

    // Subsort by subject
    return a.course.subject.localeCompare(b.course.subject);
}
