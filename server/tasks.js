const ScheduledTask = require('./utils/scheduled-task');

const fetchCourses = require('./scripts/fetch-courses');
const fetchRateMyProf = require('./scripts/fetch-ratemyprofessor');

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

        tasks = [purdueCatalogTask, rateMyProfTask];

        await Promise.all(tasks.map(async task => {
            if (task.status === 'running') {
                task.model.status = 'interrupted';
                await task.model.save();
            }
        }));

        if (process.argv.includes('--update-ratings'))
            rateMyProfTask.run({}, true);

        if (process.argv.includes('--update-courses'))
            purdueCatalogTask.run({}, true);
    })();
};
