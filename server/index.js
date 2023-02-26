const express = require('express');
const jsonParser = require('body-parser').json();

require('dotenv').config()

async function main() {
    const models = await require('./models')(process.env.DB);

    const port = process.env.PORT;
    delete process.env.DB;

    const app = express();

    app.use(jsonParser);

    /* Load files in ./routes */
    require('./routes/index')(app);

    /* Start the server */
    app.listen(port, () => {
        console.log('listening on port', port);
    });
}

main().catch(console.error);
