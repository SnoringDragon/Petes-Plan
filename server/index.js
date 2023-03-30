const express = require('express');
const jsonParser = require('body-parser').json();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fetchCourses = require('./scripts/fetch-courses');
const fetchRateMyProf = require('./scripts/fetch-ratemyprofessor');
const {scheduleRepeat} = require("./utils/scheduler");

require('dotenv').config()

async function main() {
    const models = await require('./models')(process.env.DB);

    const port = process.env.PORT;
    delete process.env.DB;

    await require('./tasks')();

    const app = express();

    app.use(cors());
    app.use(jsonParser);
    app.use(cookieParser());

    /* Load files in ./routes */
    require('./routes/index')(app);

    if (process.argv.includes('--update-ap'))
        require('./scripts/fetch-ap')().catch(console.error);
    
    if (process.argv.includes('--populate-test'))
        require('./scripts/populate-test')().catch(console.error);

    scheduleRepeat(() => {
        fetchCourses().catch(console.error);
    }, process.env.COURSE_FETCH_TIME);

    /* Start the server */
    app.listen(port, () => {
        console.log('listening on port', port);
    });

    return app;
}

module.exports = main().catch(console.error);
