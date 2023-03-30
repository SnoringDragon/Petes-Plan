//https://www.boilergrades.com/api/grades?instructor=Pushkar,%20Yulia%20N.

function getInstructorURL(fName, mInit = null, lName) {
    let instructorURL = "https://www.boilergrades.com/api/grades?instructor="+lName+",%20"+fName;
    if (mInit) {
        instructorURL+=("%20" + mInit + ".");
    }
    return instructorURL;
}

function getInstructorData(fName, mInit = null, lName) {
    url = getInstructorURL(fName, mInit, lName);
    fetch(url)
    .then((response) => response.json())
    .then((data) => console.log(data));
    console.log(response);
}
url = getInstructorURL("Jeffrey", "A", "Turkstra");
console.log(url);
// console.log(fetch(url));
