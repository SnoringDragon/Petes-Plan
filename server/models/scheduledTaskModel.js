const mongoose = require('mongoose');

const scheduledTaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    lastRun: Date,
    status: {
        type: String,
        enum: ['running', 'successful', 'interrupted', 'errored', 'aborted', 'unknown', 'deferred'],
        default: 'unknown'
    },
    scheduledAt: {
        type: String,
        required: true,
        default: '4 AM'
    }
});

module.exports = mongoose.model('ScheduledTask', scheduledTaskSchema);
