const mongoose = require('mongoose');
const cheerio = require('cheerio');

//get Table of CLEP Credit
//table.getElementsByTagName('table-responsive')
function getClepData() {
    fetch('https://www.admissions.purdue.edu/transfercredit/clep.php?_ga=2.156040763.1830545689.1680885941-405777200.1660331919')
  .then(response => response.text())
  .then(content => {
    // parse the content using DOMParser
    //cheerio
    var $ = cheerio.load(content)
    allClasses = []
    allCourses = []
    allHours = []
    allScores =[]
    
    $("#inner-page-content > div > div > div.col-lg-8.main-content > div > table > tbody > tr > td:nth-child(1)").each((index, element) => {
        allClasses.push([$(element).text()]);
      });
      console.log(allClasses[0])
    }
    
    // find all elements with the tag name 'div' and class 'table-responsive'
    // const tables = $('td');
    // console.log((tables).length)
    // for (var i = 0; i < tables.length; i++) {
    //   if (tableResponsiveElements[i].className == 'table-responsive') {
    //     // do something with the element
    //     console.log(tableResponsiveElements[i]);
    //   }
    // }
  );
    //gets table
    // fetch('https://www.admissions.purdue.edu/transfercredit/clep.php?_ga=2.156040763.1830545689.1680885941-405777200.1660331919').then((response) => response.text()).then((text) => console.log(text));
//     $.get('https://stackoverflow.com/questions').then(function (html) {
//     // Success response
//     var $mainbar = $(html).find('#mainbar');
//     document.write($mainbar.html());
// }, function () {
//     // Error response
//     document.write('Access denied');
// });
    
//     var oTable = document.getElementsByTagName('table-responsive');
//     console.log(oTable)
//     //gets rows of table   
//     var rowLength = oTable.rows.length;

//     //loops through rows    
//     for (i = 0; i < rowLength; i++){

//     //gets cells of current row  
//    var oCells = oTable.rows.item(i).cells;

//    //gets amount of cells of current row
//    var cellLength = oCells.length;

//    //loops through each cell in current row
//     for(var j = 0; j < cellLength; j++){
//       // get your cell info here
//       var cellVal = oCells.item(j).innerHTML;
//       console.log(cellVal);
//    }
// }
}

getClepData()