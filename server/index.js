const express = require('express');

require('dotenv').config()

async function main() {
    const models = await require('./models')(process.env.DB);

    const port = process.env.PORT;
    delete process.env.DB;

    const app = express();

    require('./routes')(app);

    app.listen(port, () => {
        console.log('listening on port', port);
    });
}

main().catch(console.error);
