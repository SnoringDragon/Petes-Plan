// nicknames csv from https://github.com/carltonnorthern/nicknames

const fs = require('fs');
const path = require('path');

const database = {};

const similar = {
    'steven': ['stephen'],
    'stephen': ['steven'],
    'leslie': ['lesley'],
    'lesley': ['leslie']
};

fs.readFileSync(path.join(__dirname, 'names.csv')).toString()
    .split(/\r?\n/g).forEach(line => {
        const [name, ...nicknames] = line.trim().split(/,/g);
        nicknames.forEach(nick => {
            if (!(nick in database)) database[nick] = []
            database[nick].push(name);
        });
    });

module.exports = {
    nicknames: Object.freeze(database),
    similarNames: Object.freeze(similar)
};
