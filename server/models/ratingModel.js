const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        index: true // speed up fetching by instructor
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        index: true // speed up fetching by course
    },
    quality: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }, // rating
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: String,
    tags: {
        type: [String],
        index: true
    },

    typeSpecificId: String

}, { discriminatorKey: 'type' });

ratingSchema.index({ type: 1 });

// speed up fetching by instructor, course combo
ratingSchema.index({ instructor: 1, course: 1 });

// for each type, only have one type specific id
ratingSchema.index({ type: 1, typeSpecificId: 1 }, {
    unique: true,
    partialFilterExpression: { // only index documents where typeSpecificId is defined
        typeSpecificId: { $type: 'string' }
    }
})

const Rating = mongoose.model('Rating', ratingSchema);

const RateMyProfRating = Rating.discriminator('ratemyprofessor', new mongoose.Schema({
    isForCredit: Boolean,
    isForOnlineClass: Boolean,
    isTextbookUsed: Boolean,
    wouldTakeAgain: Boolean,
    isAttendanceMandatory: Boolean
}));

module.exports = { Rating, RateMyProfRating }
