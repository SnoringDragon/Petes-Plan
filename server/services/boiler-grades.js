let apiResponse;
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

// ------------ INSTRUCTOR REQUESTS FROM BG -------------------
//Main function is getBGInstructor(fName, mName, lName) //all fields are required but if no middle name then input null

function getInstructorURL(fName, mInit = null, lName) {
    let instructorURL = "https://www.boilergrades.com/api/grades?instructor="+lName+",%20"+fName;
    if (mInit) {
        instructorURL+=("%20" + mInit + ".");
    }
    return instructorURL;
}

function fetchInstructorData(fName, mInit = null, lName, callback) {
    let url = getInstructorURL(fName, mInit, lName);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          callback(response);
        } else {
          console.error('Error fetching data. Status:', xhr.status);
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
}
  
function returnData(data) {
    // Do something with the data
    console.log(data);
    return(data)
}

function getBGInstructor(fName = "Sula", mName = null, lName = "Lee") {
    fetchInstructorData(fName = "Sula", mName = null, lName = "Lee", callback = returnData);
}

// ------------ COURSE REQUESTS FROM BG -------------------
//Main function is getBGCourse(courseID)

function getCourseURL(courseID) {
    let courseIDComponents = courseID.match(/[a-zA-Z]+|[0-9]+/g)
    let courseURL = "https://www.boilergrades.com/api/grades?course="+courseIDComponents[0]+"%20"+courseIDComponents[1];
    return courseURL;
}

function getCourseData(courseID, callback) {
    let url = getCourseURL(courseID);
    console.log(url)
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          callback(response);
        } else {
          console.error('Error fetching data. Status:', xhr.status);
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
}

function getBGCourse(courseID) {
    getCourseData(courseID, callback = returnData);
}

// Instruc Ex: console.log("inside, ", getBGInstructor(fName = "Sula", mName = null, lName = "Lee"));
// Course Ex: console.log(getBGCourse("BIOL 11000"))
module.exports = getBGInstructor;
module.exports = getBGCourse;