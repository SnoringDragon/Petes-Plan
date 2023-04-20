const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
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
    dateSubmitted: String,

    wouldTakeAgain: Boolean,
    grade: String,

    typeSpecificId: String
    

}, {
    discriminatorKey: 'type',
    timestamps: true
});

ratingSchema.index({ instructor: 'hashed' }); // speed up fetching by instructor

ratingSchema.index({ course: 'hashed' }); // speed up fetching by course

ratingSchema.index({ type: 1 });

// speed up fetching by instructor, course combo
ratingSchema.index({ instructor: 1, course: 1 });

// for each type, only have one type specific id
ratingSchema.index({ type: 1, typeSpecificId: 1 }, {
    unique: true,
    partialFilterExpression: { // only index documents where typeSpecificId is defined
        typeSpecificId: { $type: 'string' }
    }
});

ratingSchema.index({ typeSpecificId: 'hashed' }, {
    background: false
});

const Rating = mongoose.model('Rating', ratingSchema);

const RateMyProfRating = Rating.discriminator('ratemyprofessor', new mongoose.Schema({
    isForCredit: Boolean,
    isForOnlineClass: Boolean,
    isTextbookUsed: Boolean,
    isAttendanceMandatory: Boolean
}));

module.exports = { Rating, RateMyProfRating }
