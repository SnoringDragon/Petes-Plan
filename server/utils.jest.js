const mongoose = require('mongoose');

const staticOptions = {
    autoIndex: true
};

module.exports.connect = async (config = {}) => {
   const options = Object.assign({}, staticOptions);

   const connectionString = 'mongodb://127.0.0.1:11223/';

   let connection;
   if (config.createNewConnection) {
       connection = await mongoose.createConnection(connectionString, options).asPromise();
   } else {
       await mongoose.connect(connectionString, options);
       connection = mongoose.connection;
   }

   return connection;
}

module.exports.disconnect = () => mongoose.disconnect();
