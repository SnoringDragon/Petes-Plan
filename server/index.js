const express = require('express');

require('dotenv').config()

async function main() {
    const models = await require('./models')(process.env.DB);

    const port = process.env.PORT;
    delete process.env.DB;

    await require('./tasks')();

    if (process.argv.includes('--update-ap'))
        require('./scripts/fetch-ap')().catch(console.error);
    
    if (process.argv.includes('--populate-test'))
        require('./scripts/populate-test')().catch(console.error);

    const app = require('./app')();

    /* Start the server */
    app.listen(port, () => {
        console.log('listening on port', port);
    });
}

main().catch(console.error);
