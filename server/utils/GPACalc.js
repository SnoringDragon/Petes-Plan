const courseModel = require('../models/courseModel');
const usercourseModel = require('../models/userCourseModel');
const degreeModel = require('../models/degreeModel');

async function calculateGPA(userCourseModels) {
    let GPAQualPts = [];
    let creditHours = [];
    let creditHourSum = 0;
    let creditHour = 0;
    //userCourseModels is list of userCourseModel docs 
    for (let i = 0; i < userCourseModels.length; i++) {
        if (!userCourseModels[i].grade.localeCompare("A+") || !userCourseModels[i].grade.localeCompare("A")) {
            GPAQualPts.push(4.0);
        } else if (!userCourseModels[i].grade.localeCompare("A-")) {
            GPAQualPts.push(3.7);
        } else if (!userCourseModels[i].grade.localeCompare("B+")) {
            GPAQualPts.push(3.3);
        } else if (!userCourseModels[i].grade.localeCompare("B")) {
            GPAQualPts.push(3.0);
        } else if (!userCourseModels[i].grade.localeCompare("B-")) {
            GPAQualPts.push(2.7);
        } else if (!userCourseModels[i].grade.localeCompare("C+")) {
            GPAQualPts.push(2.3);
        } else if (!userCourseModels[i].grade.localeCompare("C")) {
            GPAQualPts.push(2.0);
        } else if (!userCourseModels[i].grade.localeCompare("C-")) {
            GPAQualPts.push(1.7);
        } else if (!userCourseModels[i].grade.localeCompare("D+")) {
            GPAQualPts.push(1.3);
        } else if (!userCourseModels[i].grade.localeCompare("D")) {
            GPAQualPts.push(1.0);
        } else if (!userCourseModels[i].grade.localeCompare("D-")) {
            GPAQualPts.push(0.7);
        } else if (!userCourseModels[i].grade.localeCompare("E") || !userCourseModels[i].grade.localeCompare("F") || !userCourseModels[i].grade.localeCompare("IF")) {
            GPAQualPts.push(0.0);
        } else {
            continue; // WIP, TR, P, N, I, PI, SI, W, WF, WN, WU, IN, IU, AU, NS are Not included
        }
        creditHour = courseModel.findOne({ courseID: userCourseModels[i].courseID })
        creditHour.exec(function (err) {
            if (err) {
                return "Error: This course does not have credit hours.";
            }
        });
        creditHours.push(creditHour.maxCredits);
        creditHourSum += creditHour;
    }
    indexPts = 0;
    for (let i = 0; i < creditHours.length; i++) {
        indexPts += creditHours[i] * GPAQualPts[i];
    }
    return indexPts, creditHourSum;

}

exports.cumulativeGPA = async (req, res) => {
    //userCourseModels is doc array
    //hopefully this only pulls current user's courses
    let userCourseModels = req.user.completedCourses;
    indexPts, creditHoursum = calculateGPA(userCourseModels);
    return indexPts / creditHoursum;
}

exports.semesterGPA = async (req, res, semesterInput, yearInput) => {
    let userCourseModels = req.user.completedCourses.find({ semester: semesterInput, year: yearInput });
    userCourseModels.exec(function (err) {
        if (err) {
            return "Error: Invalid semester. Please include a semester with completed courses.";
        }
    });
    indexPts, creditHourSum = calculateGPA(userCourseModels);
    return indexPts / creditHourSum;
}

async function concentrationGPA(req, res, major) {
    //cycle through all of user's concentrations, see which ones apply to major -- if it applies, add it to major GPA
    let majorDoc = degreeModel.findOne({ name: major, type: 'major' });
    majorDoc.exec(function (err) {
        if (err) {
            return "Error: Major does not exist. Please pick a different major.";
        }
    });
    let major_concentrations = [];
    let major_concentrations_names = [];

    let concentrIndexPtsSum, concentrCreditHourSum = 0;
    //add all major concentrations and their names
    for (let i = 0; i < degreeModel.concentrations.length; i++) {
        let concentration = degreeModel.findById(majorDoc.concentrations[i]);
        concentration.exec(function (err) {
            if (err) {
                return "Error: Concentration does not exist.";
            }
        });
        major_concentrations.push(concentration);
        major_concentrations_names.push(concentration.name);
    }

    //if the student is taking the concentration, calculateGPA for those courses
    for (let i = 0; i < req.user.degreePlans.degrees.length; i++) {
        let concentrCourses = [];
        if (major_concentrations_names.contains(req.user.degreePlans.degrees[i].name)) {
            for (let i = 0; i < req.user.degreePlans.degrees[i].requirements.length; i++) {
                let course = usercourseModel.findOne({ courseID: req.user.degreePlans.degrees[i].requirements[i] });
                course.exec(function (err, courseRet) {
                    if (err) {
                        return "Error: Course does not exist.";
                    }
                    if (courseRet) {
                        concentrCourses.push(courseRet);
                    } 
                });
            }
            let concentrIndexPts, concentrCreditHour = calculateGPA(concentrCourses);
            concentrIndexPtsSum += concentrIndexPts;
            concentrCreditHourSum += concentrCreditHour;
        }
    }
    return concentrIndexPtsSum, concentrCreditHourSum;
}

exports.majorGPA = async (req, res, major) => {
    //doesn't include concentration GPA
    let majorDoc = await degreeModel.findOne({ name: major, type: 'major' }).exec();
    let requirements = majorDoc.requirements; //series of requirements: Course objects
    let userCourseModels = req.user.completedCourses;  //completed courses: UserCourse objects
    let majorCourses = [];
    let requirementIDs = [];
    //add all major requirements to requirementIDs 
    for (let i = 0; i < requirements.length; i++) {
        requirementIDs.push(requirements.courseID);
    }
    //if the completed courses are also in major requirements, include them
    for (let i = 0; i < userCourseModels.length; i++) {
        if (requirementIDs.contains(userCourseModels[i].courseID)) {
            majorCourses.push(await courseModel.findOne({ coueseID: userCourseModels[i].courseID }));
        }
    }
    let majorIndexPts, majorCreditHourSum = calculateGPA(majorCourses);
    let concentrIndexPtsSum, concentrCreditHourSum = concentrationGPA(req, res, major);
    majorIndexPts += concentrIndexPtsSum;
    majorCreditHourSum += concentrCreditHourSum;
    return majorIndexPts / majorCreditHourSum;
}


