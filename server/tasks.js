const ScheduledTask = require('./utils/scheduled-task');

const fetchCourses = require('./scripts/fetch-courses');
const fetchRateMyProf = require('./scripts/fetch-ratemyprofessor');
const fetchDegrees = require('./scripts/fetch-degrees');
const fetchBoilergrades = require('./scripts/fetch-boilergrades');

let tasks = null;

module.exports = () => {
    if (tasks) return tasks;

    return (async () => {
        const purdueCatalogTask = await ScheduledTask.create({
            taskfunc: fetchCourses,
            name: 'Update Course Catalog',
            args: { batchSize: 10, sleepTime: 750, numYears: 6 },
        });

        const rateMyProfTask = await ScheduledTask.create({
            taskfunc: fetchRateMyProf,
            name: 'Fetch Rate My Professor Reviews',
            dependencies: [purdueCatalogTask]
        });

        const fetchDegreeTask = await ScheduledTask.create({
            taskfunc: fetchDegrees,
            name: 'Update Degree Catalog',
            args: { batchSize: 10, sleepTime: 250 }
        });

        const boilergradesTask = await ScheduledTask.create({
            taskfunc: fetchBoilergrades,
            name: 'Update BoilerGrades Info',
            args: { batchSize: 10, sleepTime: 250 }
        });

        tasks = [purdueCatalogTask, rateMyProfTask, fetchDegreeTask, boilergradesTask];

        await Promise.all(tasks.map(async task => {
            if (task.status === 'running') {
                task.model.status = 'interrupted';
                await task.model.save();
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
    })();
};
