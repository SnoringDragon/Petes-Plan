const express = require('express');

require('dotenv').config()

async function main() {
    const models = await require('./models')(process.env.DB);

    const port = process.env.PORT || 8000;
    delete process.env.DB;

    await require('./tasks')();

    const app = require('./app')();

    /* Start the server */
    app.listen(port, '0.0.0.0', () => {
        console.log('listening on port', port);
    });
}

main().catch(console.error);
