let apiResponse;

const fetch = import('node-fetch');

// ------------ INSTRUCTOR REQUESTS FROM BG -------------------
//Main function is getBGInstructor(fName, mName, lName) //all fields are required but if no middle name then input null

function getInstructorURL(fName, mInit = null, lName) {
    let instructorURL = "https://www.boilergrades.com/api/grades?instructor="+lName+",%20"+fName;
    if (mInit) {
        instructorURL+=("%20" + mInit + ".");
    }
    return instructorURL;
}

async function fetchInstructorData(fName, mInit = null, lName) {
    return (await (await fetch).default(getInstructorURL(fName, mInit, lName))).json();
}
  
function returnData(data) {
    // Do something with the data
    console.log(data);
    return(data)
}

function getBGInstructor(fName, lName) {
    return fetchInstructorData(fName, mName = null, lName);
}

// ------------ COURSE REQUESTS FROM BG -------------------
//Main function is getBGCourse(courseID)

function getCourseURL({ courseID, subject }) {
    let courseURL = "https://www.boilergrades.com/api/grades?course="+subject+"%20"+courseID;
    return courseURL;
}

async function getCourseData({courseID, subject}) {
    return (await (await fetch).default(getCourseURL({ courseID, subject }))).json();
}

function getBGCourse({ courseID, subject }) {
    return getCourseData({ courseID, subject });
}

const getBGSubject = async (subject) => {
    return (await (await fetch).default('https://boilergrades.com/api/grades?subject=' + subject)).json()
}

// Instruc Ex: console.log("inside, ", getBGInstructor(fName = "Sula", mName = null, lName = "Lee"));
// Course Ex: 
// console.log(getBGCourse("BIOL 11000"))
module.exports = { getBGInstructor, getBGCourse, getBGSubject };
