const mongoose = require('mongoose');
const degreeModel = require('../models/degreeModel');

//All possible degrees in Purdue CS Department
const names = ["Computer Science", "Data Science", 
"Artificial Intelligence", "Computational Science and Engineering Track",
"Computer Graphics and Visualization Track", "Database and Information Systems Track", 
"(Algorithmic) Foundations Track", "Programming Language Track", 
"Security Track", "Software Engineering Track", "Systems Software Track", "Machine Intelligence Track"]

let types = ['major','concentration', 'minor'];
let requirements = [['MA 261', 'MA 35100', 'CS 18000', 'CS 18200', 'CS 24000', 'CS 25000', 'CS 25100', 'CS 25200'], 
['CS 18000', 'CS 18200', 'CS 19100', 'CS 19300', 'CS 24200', 'CS 25100', 'CS 38003','MA 26100', 'MA 35100', 'STAT 35500', 'STAT 41600', 'STAT 41700', 'CS 490', 'PHIL 208'], 
['CS 17600', 'PSY 12000', 'CS 18000', 'CS 18200', 'CS 24200', 'MA 26100', 'PHIL 20700', 'CS 25100', 'MA 26500', 'STAT 41600', 'PHIL 22100', 'CS 37300', 'CS 38100', 'CS 47100'],
['MA 26600', 'CS 31400', 'CS 30700', 'CS 33400', 'CS 35200', 'CS 35400', 'CS 38100'],
['CS 33400', 'CS 31400', 'CS 31400','CS 35200','CS 35400','CS 38100','CS 42200','CS 43400','CS 44800','CS 47100','CS 49000'],
['CS 34800', 'CS 38100', 'CS 44800', 'CS 37300','CS 35200','CS 35500','CS 37300'],
['CS 35200', 'CS 37300', 'CS 38100', 'CS 31400','CS 33400','CS 35300'],
['CS 35200', 'CS 35400', 'CS 45600', 'CS 30700', 'CS 35300', 'CS 38100', 'CS 42200', 'CS 48300'],
['CS 35400','CS 35500','CS 42600','CS 30700', 'CS 34800', 'CS 35200'],
['CS 30700', 'CS 35200', 'CS 40800', 'CS 40700', 'CS 34800', 'CS 35300', 'CS 35400'],
['CS 35200', 'CS 35400', 'CS 42200', 'CS 30700', 'CS 33400', 'CS 35300'],
['CS 37300','CS 38100', 'CS 47100', 'STAT 41600', 'CS 34800', 'CS 35200'],
['CS 18000', 'CS 18200', 'CS 24000', 'CS 25000', 'CS 25100', 'CS 25200']].map(x => x.map(c => { const [subject, courseID] = c.split(' '); return { subject, courseID } }));


// let concentrations = names.slice(3);


function handleError() {
    console.log("populate track working");
}

module.exports = async () => { async function populateAll() {
const cseTrack = await degreeModel.create({ name: names[3], type: types[1], requirements: requirements[3]});

const cgvtTrack = await degreeModel.create({ name: names[4], type: types[1], requirements: requirements[4]});

const disTrack = await  degreeModel.create({ name: names[5], type: types[1], requirements: requirements[5]});
const afTrack =  await degreeModel.create({ name: names[6], type: types[1], requirements: requirements[6]});
const plTrack =  await degreeModel.create({ name: names[7], type: types[1], requirements: requirements[7]});
const sTrack =  await degreeModel.create({ name: names[8], type: types[1], requirements: requirements[8]});
const seTrack = await  degreeModel.create({ name: names[9], type: types[1], requirements: requirements[9]});
const ssTrack = await  degreeModel.create({ name: names[10], type: types[1], requirements: requirements[10]});
const miTrack = await  degreeModel.create({ name: names[11], type: types[1], requirements: requirements[11]});
const cs = await degreeModel.create({ name: names[0], type: types[0], requirements: requirements[0], concentrations: [cseTrack, cgvtTrack, disTrack, afTrack, plTrack, sTrack, seTrack, ssTrack, miTrack].map(x => x._id)});
const ds = await degreeModel.create({ name: names[1], type: types[0], requirements: requirements[1]});
const ai = await degreeModel.create({ name: names[2], type: types[0], requirements: requirements[2]});

const csMinor = await degreeModel.create({ name: 'Computer Science', type: types[2], requirements: requirements[12] })
const dsMinor = await degreeModel.create({ name: 'Data Science', type: types[2], requirements: requirements[12] })

}

await populateAll();
}
// mongoose.model('Instructor', instructorSchema);