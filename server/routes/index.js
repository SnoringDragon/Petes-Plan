const fs = require('fs');

module.exports = app => {
    /* Load all files except index.js in current dir */
    fs.readdirSync(__dirname).forEach(file => {
        if (file.includes('index.')) return;
        require('./' + file)(app);
    });
};
