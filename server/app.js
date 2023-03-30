const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jsonParser = require('body-parser').json();

let app;

module.exports = () => {
    app = express();

    app.use(cors());
    app.use(jsonParser);
    app.use(cookieParser());

    /* Load files in ./routes */
    require('./routes/index')(app);

    return app;
};
