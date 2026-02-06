const ScheduledTask = require('./utils/scheduled-task');

const fetchCourses = require('./scripts/fetch-courses');
const fetchRateMyProf = require('./scripts/fetch-ratemyprofessor');
const fetchDegrees = require('./scripts/fetch-degrees');
const fetchBoilergrades = require('./scripts/fetch-boilergrades');
const fetchAp = require('./scripts/fetch-ap');
const fetchClep = require('./scripts/fetch-clep');

let tasks = null;

module.exports = () => {
    if (tasks) return tasks;

    return (async () => {
        const purdueCatalogTask = await ScheduledTask.create({
            taskfunc: fetchCourses,
            name: 'Update Course Catalog',
            args: { batchSize: 10, sleepTime: 750, numYears: 6 },
            defaultSchedule: '0 5 1 * 0'
        });

        const rateMyProfTask = await ScheduledTask.create({
            taskfunc: fetchRateMyProf,
            name: 'Fetch Rate My Professor Reviews',
            dependencies: [purdueCatalogTask],
            defaultSchedule: '0 5 * * *'
        });

        const fetchDegreeTask = await ScheduledTask.create({
            taskfunc: fetchDegrees,
            name: 'Update Degree Catalog',
            args: { batchSize: 10, sleepTime: 250 },
            defaultSchedule: '0 5 1 1,7-8,12 *'
        });

        const boilergradesTask = await ScheduledTask.create({
            taskfunc: fetchBoilergrades,
            name: 'Update BoilerGrades Info',
            args: { batchSize: 20, sleepTime: 50 },
            defaultSchedule: '0 5 1 1,7-8,12 *'
        });

        const apTask = await ScheduledTask.create({
            taskfunc: fetchAp,
            name: 'Update AP Tests',
            args: {},
            defaultSchedule: '0 5 1 1 *'
        });

        const clepTask = await ScheduledTask.create({
            taskfunc: fetchClep,
            name: 'Update CLEP Tests',
            args: {},
            defaultSchedule: '0 5 1 1 *'
        });


        tasks = [purdueCatalogTask, rateMyProfTask, fetchDegreeTask, boilergradesTask, apTask, clepTask];

        await Promise.all(tasks.map(async task => {
            if (task.status === 'running') {
                task.model.status = 'interrupted';
                await task.model.save();
            }

            if (task.status === 'unknown' && process.env.NODE_ENV === 'production') {
                console.log('task', task.model.name, 'never run before, running for first time');
                task.run();
            }
        }));

        const force = process.argv.includes('--force');

        if (process.argv.includes('--update-ratings'))
            rateMyProfTask.run({}, force);

        if (process.argv.includes('--update-courses'))
            purdueCatalogTask.run({}, force);

        if (process.argv.includes('--update-degrees'))
            fetchDegreeTask.run({}, force);

        if (process.argv.includes('--update-boilergrades'))
            boilergradesTask.run({}, force);

        if (process.argv.includes('--update-ap'))
            apTask.run({}, force);

        if (process.argv.includes('--update-clep'))
            clepTask.run({}, force);
    })();
};
