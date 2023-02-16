const fs = require('fs');

module.exports = app => {
    fs.readdirSync(__dirname).forEach(file => {
        if (file.includes('index.')) return;
        require('./' + file)(app);
    });
};
