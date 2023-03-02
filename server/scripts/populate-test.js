const mongoose = require('mongoose');
const courseModel = require('../models/courseModel');

const names = ["Problem Solving And Object-Oriented Programming", "Foundations Of Computer Science", 
"Tools", "Programming In C", "Introduction To Data Science", 
"Computer Architecture", "Data Structures And Algorithms", 
"Systems Programming", "Software Engineering I", "Fundamentals Of Computer Graphics", 
"Information Systems", "Cloud Computing", "Compilers: Principles And Practice", "Operating Systems", 
"Introduction To Cryptography", "Data Mining And Machine Learning", "Python Programming", 
"Introduction To The Analysis Of Algorithms", "Competitive Programming II", "Great Issues In Computer Sci"]

let subject = 'CS'
const courseIDs = ['18000', '18200', '19300', '24000', '24200', '25000', '25100', '25200', "30700", "33400",
"34800", "35100", "35200", "35400", "35500", "37300", "38003", "38100", "39000-CP2", "CS 39000-GIS"]

const newCourse = new courseModel({ size: 'small' });

