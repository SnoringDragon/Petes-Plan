const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    nickname: String,
    email: {
        type: String,
        unique: true,
        sparse: true,
        background: false
    },
    rateMyProfIds: {
        type: [String]
    }
});

instructorSchema.index({ firstname: 1, lastname: 1 }, { background: false });
instructorSchema.index({ firstname: 'text', lastname: 'text', nickname: 'text' }, {
    default_language: 'none', // dont stem names
    weights: {
        firstname: 1,
        lastname: 2,
        nickname: 2
    }
});
instructorSchema.index({ rateMyProfIds: 1 }, {
    unique: true,
    background: false,
    partialFilterExpression: { rateMyProfIds: { $gt: [] } } // only index non-empty arrays
});


module.exports = mongoose.model('Instructor', instructorSchema);
