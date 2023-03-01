const express = require('express');
const jsonParser = require('body-parser').json();
const cors = require('cors');
const fetchCourses = require('./scripts/fetch-courses');
const {scheduleRepeat} = require("./utils/scheduler");

require('dotenv').config()

async function main() {
    const models = await require('./models')(process.env.DB);

    const port = process.env.PORT;
    delete process.env.DB;

    const app = express();

    app.use(cors());
    app.use(jsonParser);

    /* Load files in ./routes */
    require('./routes/index')(app);

    if (process.argv.includes('--update-courses'))
        fetchCourses().catch(console.error);

    scheduleRepeat(() => {
        fetchCourses().catch(console.error);
    }, process.env.COURSE_FETCH_TIME);

    /* Start the server */
    app.listen(port, () => {
        console.log('listening on port', port);
    });
}

main().catch(console.error);
