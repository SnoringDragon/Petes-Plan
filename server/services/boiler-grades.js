//https://www.boilergrades.com/api/grades?instructor=Pushkar,%20Yulia%20N.

let apiResponse;
let url;
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

//Main function is getBGInstructor(fName, mName, lName) //all fields are required but if no middle name then input null
function getInstructorURL(fName, mInit = null, lName) {
    let instructorURL = "https://www.boilergrades.com/api/grades?instructor="+lName+",%20"+fName;
    if (mInit) {
        instructorURL+=("%20" + mInit + ".");
    }
    return instructorURL;
}

function getInstructorData(fName, mInit = null, lName, callback) {
    url = getInstructorURL(fName, mInit, lName);
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
    console.log(data[0]);
    return(data[0])
}

function getBGInstructor(fName = "Sula", mName = null, lName = "Lee") {
    getInstructorData(fName = "Sula", mName = null, lName = "Lee", callback = returnData);
}

module.exports = getBGInstructor;

// console.log("inside, ", getBGInstructor(fName = "Sula", mName = null, lName = "Lee"));

