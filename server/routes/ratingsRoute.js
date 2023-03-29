const { Router } = require('express');
const mongoose = require('mongoose');

const Course = require('../models/courseModel');
const Instructor = require('../models/instructorModel');
const {Rating} = require("../models/ratingModel");
const toTitleCase = require("../utils/title-case");

module.exports = app => {
    const router = Router();

    router.get('/', async (req, res) => {
        const filter = {};

        if (req.query.course) {
            try {
                filter.course = mongoose.Types.ObjectId(req.query.course);
            } catch {
                return res.status(400).json({message: 'invalid course id'});
            }
        } else if (req.query.courseID && req.query.subject) {
            const course = await Course.findOne({
                courseID: req.query.courseID,
                subject: req.query.subject
            });

            if (!course)
                return res.status(400).json({message: 'invalid course'});
            filter.course = course._id;
        }

        if (req.query.instructor) {
            try {
                filter.instructor = mongoose.Types.ObjectId(req.query.instructor);
            } catch {
                return res.status(400).json({message: 'invalid instructor id'});
            }
        } else if (req.query.email) {
            const instructor = await Instructor.findOne({email: req.query.email});

            if (!instructor)
                return res.status(400).json({message: 'invalid instructor email'});
            filter.instructor = instructor._id;
        }

        if (req.query.type)
            filter.type = req.query.type;

        if (!filter.instructor && !filter.course)
            return res.status(400).json({message: 'course and/or instructor must be specified'})

        let skip = 0;
        let limit;
        if (req.query.skip) {
            skip = +req.query.skip;

            if (!Number.isInteger(skip) || skip < 0)
                return res.status(400).json({message: 'invalid value for skip'});
        }

        if (req.query.limit) {
            limit = +req.query.limit;

            if (!Number.isInteger(limit) || limit <= 0)
                return res.status(400).json({message: 'invalid value for limit'});
        }

        const numericalRatingKeys = ['quality', 'difficulty'];

        const ratings = await Rating.aggregate([{
            $match: filter
        }, {
            $sort: {createdAt: -1}
        }, {
            $facet: {
                // get metadata (count, average rating, etc)
                metadata: [{
                    $group: { // aggregate over entire collection
                        _id: null,
                        // get total count
                        count: {$count: {}},
                        // get set of courses in these reviews
                        courses: {$addToSet: '$course'},
                        // get set of instructors in these reviews
                        instructors: {$addToSet: '$instructor'},
                        numTakeAgain: { $sum: { $cond: [{$eq: ['$wouldTakeAgain', true]}, 1, 0] } },
                        totalTakeAgain: { $sum: { $cond: [{$ne: ['$wouldTakeAgain', null]}, 1, 0] } },
                        // compute rating averages and summaries
                        ...Object.fromEntries(numericalRatingKeys.flatMap(key =>
                            [[`avg${toTitleCase(key)}`, {$avg: `$${key}`}], // compute average of this key
                                // compute count of numbers which are in each rating range (1,2,3,4,5)
                                ...[...new Array(5)].map((_, i) => [
                                    `${key}${i + 1}`, {
                                        $sum: {
                                            $cond: [{$eq: [{$round: `$${key}`}, i + 1]}, 1, 0]
                                        }
                                    }
                                ])]))
                    }
                }, {
                    $project: {
                        _id: 0,
                        count: 1,
                        wouldTakeAgain: { $cond: [
                            { $eq: ['$totalTakeAgain', 0] },
                                null,
                                {$divide: ['$numTakeAgain', '$totalTakeAgain']}] },
                        courses: { $setDifference: ['$courses', [null]] },
                        instructors: { $setDifference: ['$instructors', [null]] },
                        ...Object.fromEntries(numericalRatingKeys.flatMap(key => [
                            [`num${toTitleCase(key)}`, [...new Array(5)]
                                .map((_, i) => `$${key}${i + 1}`)], // flatten summary count to array
                            [`avg${toTitleCase(key)}`, 1]
                        ]))
                    }
                }],
                // get most common tags
                tags: [{
                    $unwind: '$tags'
                }, {
                    $group: {
                        // count amount for each tag
                        _id: '$tags',
                        count: { $count: {} }
                    }
                }, {
                    $sort: { count: -1 }
                }, {
                    $project: {
                        name: '$_id',
                        count: 1,
                        _id: 0
                    }
                }],
                // get documents returned by query
                data: [{ $skip: skip }, ...(typeof limit === 'number' ? [{ $limit: limit }] : [])]
            }
        }, {
            // move tags to metadata.tags
            $set: { 'metadata.tags': '$tags' }
        }, {
            $project: {
                metadata: {$arrayElemAt: ['$metadata', 0]}, // metadata is in array with one element, get first element
                data: 1
            }
        }]);

        // no reviews
        if (!ratings[0].data.length)
            return res.json({ data: [], metadata: null });

        const courseSelection = {
            courseID: 1,
            subject: 1,
            _id: 1,
            name: 1
        };

        // populate courses and instructors
        await Promise.all([
            Rating.populate(ratings[0].data, {
                path: 'course',
                select: courseSelection
            }),
            Rating.populate(ratings[0].data, 'instructor'),
            Course.find({ _id: { $in: ratings[0].metadata.courses } }).select(courseSelection)
                .then(res => ratings[0].metadata.courses = res),
            Instructor.find({ _id: { $in: ratings[0].metadata.instructors } })
                .then(res => ratings[0].metadata.instructors = res.sort((a, b) => a.lastname.localeCompare(b.lastname)))
        ]);

        res.json(ratings[0]);
    });

    app.use('/api/ratings', router);
}