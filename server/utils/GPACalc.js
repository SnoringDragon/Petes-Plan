const courseModel = require('../models/courseModel');
const usercourseModel = require('../models/userCourseModel');


async function calculateGPA(userCourseModels) {
    let GPAQualPts = [];
    let qualityHours = [];
    // from letter grade to quality points
    let qualityHourSum = 0;
    let qualityHour = 0
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
            GPAQualPts.push(2);
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
        }
        // P, N, I, PI, SI, W, WF, WN, WU, IN, IU, AU, NS are Not included
        qualityHour = (await courseModel.findOne({ courseID: userCourseModels[i].courseID }).exec()).maxCredits
        qualityHours.push(qualityHour)
        qualityHourSum += qualityHour
    }
    indexPts = 0
    for (let i = 0; i < qualityHours.length; i++) {
        indexPts += qualityHours[i]*GPAQualPts
    }
    return indexPts/qualityHourSum
}
async function cumulativeGPA(userCourseModels) {
    //userCourseModels is doc array
    //hopefully this only pulls current user's courses
    let userCourseModels = await usercourseModel.find();
    return calculateGPA(userCourseModels);
}