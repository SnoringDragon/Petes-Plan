const mongoose = require('mongoose');

module.exports = async db => {
    mongoose.set('strictQuery', true);

    await mongoose.connect(db); /* Connect to the database using DB envionment variable */
};
