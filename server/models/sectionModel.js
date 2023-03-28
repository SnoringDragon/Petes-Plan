const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        index: true
    },

    name: String,
    minCredits: Number,
    maxCredits: Number,
    isHybrid: Boolean,
    sectionID: String,
    crn: Number,

    // requires other section (linkID)
    requires: String,
    linkID: String,

    meetings: [{
        _id: false,
        startDate: String,
        endDate: String,
        days: [String],
        startTime: String,
        endTime: String,
        location: String,
        instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instructors' }]
    }]
});

// only one section exists for a given semester and crn combo
sectionSchema.index({ crn: 1, semester: 1 }, { unique: true, background: false });
// speed up course search when given semester
sectionSchema.index({ course: 1, semester: 1 });

module.exports = mongoose.model('Section', sectionSchema);