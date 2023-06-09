const mongoose = require('mongoose');
const cheerio = require('cheerio');
const APTest = require('../models/apTestModel');
const fetch = import('node-fetch').then(r => r.default);

//get Table of CLEP Credit
//table.getElementsByTagName('table-responsive')
async function getClepData() {

    let allExams = [];
    let allCourses = [];
    let allHours = [];
    let allScores = [];


    await (await fetch)('https://www.admissions.purdue.edu/transfercredit/clep.php?_ga=2.156040763.1830545689.1680885941-405777200.1660331919')
  .then(response => response.text())
  .then(content => {
      // parse the content using DOMParser
    //cheerio
    var $ = cheerio.load(content)
    $("#inner-page-content > div > div > div.col-lg-8.main-content > div > table > tbody > tr > td:nth-child(1)").each((index, element) => {
        allExams.push($(element).text());
    });
    $("#inner-page-content > div > div > div.col-lg-8.main-content > div > table > tbody > tr > td:nth-child(2)").each((index, element) => {
        allCourses.push($(element).text());
    });
    $("#inner-page-content > div > div > div.col-lg-8.main-content > div > table > tbody > tr > td:nth-child(4)").each((index, element) => {
        allScores.push($(element).text());
    });
    for (let i = 0; i < allCourses.length; i++) {
        let split;
        if (allCourses[i].includes("+")) {
            split = allCourses[i].split("+");
            allCourses[i] = split;
            for (let i = 0; i < split.length; i++) {
                split[i] = split[i].trimStart();
                split[i] = split[i].trimEnd();
            }
        } else if (allCourses[i].includes("and")) {
            split = allCourses[i].split("and");
            //if one includes, the other doesn't
            if (/^([A-Z]+)\s+(\d+)((?:\s+and\s+\d+)+)/.test(allCourses[i])) {
                var pattern = /[A-Z]+/;
                let match = pattern.exec(allCourses[i])
                for (let i = 0; i < split.length; i++) {
                    if (/^\s*([0-9]+)([A-Z]*)\s*/.test(split[i])) {
                        split[i] = match[0] + split[i]
                    }
                }
            }
            for (let i = 0; i < split.length; i++) {
                split[i] = split[i].trimStart();
                split[i] = split[i].trimEnd();
            }
            allCourses[i] = split;
        }
        // console.log(allCourses[i])
    }
    }
  );
  let uniqueCLEP = new Map();
  for (let i = 0; i < allExams.length; i++) {
    let temp = []
    if (uniqueCLEP.has(allExams[i])) {
        uniqueCLEP.set(allExams[i], [...uniqueCLEP.get(allExams[i]), [allScores[i], allCourses[i]]])
    } else {
        temp.push([allScores[i], allCourses[i]])
        uniqueCLEP.set(allExams[i], temp);
    } 
    // BIOL GENERAL: [ [55+, BIOL 11000], [70+, [BIOL 11000, 11100]] ]
    //
  }
  uniqueCLEP.forEach(saveData)
}


function returnCourses(value) {
    let courses = []
    if (typeof value === "string") {
        value = value.replace(/\*/g, '').split(" ");
        courses.push({
            courseID: value[1],
            subject: value[0]
        })
    } else if (typeof value === "object") {
        for (let i = 0; i < value.length; i++) {
            let temp = value[i].replace(/\*/g, '').split(" ");
            courses.push({
                courseID: temp[1],
                subject: temp[0]
            })
        }
    }
    return courses;
}

async function saveData(value, key, map) {
    let credits = []
    for (let i = 0; i < value.length; i++) {
        credits.push({
            score: value[i][0],
            courses: returnCourses(value[i][1])
        })
    }
    await APTest.findOneAndUpdate({
        name: key,
        type: 'clep'
    }, {
        credits
    }, { upsert: true });
} 
module.exports = getClepData
