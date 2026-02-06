const RATING = {
    quality: Math.PI,
    difficulty: Math.E,
    review: 'test review',
    tags: ['test tag'],
    wouldTakeAgain: false,
    grade: 'A-',
    isForCredit: true,
    isForOnlineClass: false,
    isTextbookUsed: null,
};

beforeAll(async () => {
    const { RateMyProfRating } = require('../models/ratingModel');
    const Instructor = require('../models/instructorModel');
    const Course = require('../models/courseModel');

    const course = await Course.create({
        name: 'test course',
        subject: 'TEST',
        courseID: '10100',
    });

    const instructor = await Instructor.create({
        firstname: 'Mike',
        lastname: 'Instructor',
        email: 'mike@purdue.edu'
    });

    const rating = await RateMyProfRating.create({
        instructor: instructor._id.toString(),
        course: course._id.toString(),
        ...RATING
    });
});

const compareRating = (expected, observed) => {
    for (const key of Object.keys(expected)) {
        if (Array.isArray(observed[key]))
            expect(observed[key]).toStrictEqual(expected[key])
        else
            expect(observed[key]).toBe(expected[key])
    }
};

describe('Review Tests', () => {
    it('should return reviews by course', async () => {
        let res = await request(getApp()).get('/api/ratings?courseID=10100&subject=TEST')
            .expect(200);

        expect(res.body.data.length).toBe(1);
        expect(res.body.metadata.wouldTakeAgain).toBe(0);
        expect(res.body.metadata.instructors.length).toBe(1);
        expect(res.body.metadata.courses.length).toBe(1);
        expect(res.body.metadata.avgDifficulty).toBe(RATING.difficulty);
        expect(res.body.metadata.avgQuality).toBe(RATING.quality);
        expect(res.body.metadata.numDifficulty).toStrictEqual([0, 0, 1, 0, 0]);
        expect(res.body.metadata.numQuality).toStrictEqual([0, 0, 1, 0, 0]);
        expect(res.body.metadata.tags).toStrictEqual([{ count: 1, name: 'test tag' }])

        compareRating(RATING, res.body.data[0]);
    });

    it('should return reviews by instructor', async () => {
        let res = await request(getApp()).get('/api/ratings?email=mike@purdue.edu')
            .expect(200);

        expect(res.body.data.length).toBe(1);
        expect(res.body.metadata.wouldTakeAgain).toBe(0);
        expect(res.body.metadata.instructors.length).toBe(1);
        expect(res.body.metadata.courses.length).toBe(1);
        expect(res.body.metadata.avgDifficulty).toBe(RATING.difficulty);
        expect(res.body.metadata.avgQuality).toBe(RATING.quality);
        expect(res.body.metadata.numDifficulty).toStrictEqual([0, 0, 1, 0, 0]);
        expect(res.body.metadata.numQuality).toStrictEqual([0, 0, 1, 0, 0]);
        expect(res.body.metadata.tags).toStrictEqual([{ count: 1, name: 'test tag' }])

        compareRating(RATING, res.body.data[0]);


    });

    it('should return an error for invalid courses', async () => {
        await request(getApp()).get('/api/ratings?courseID=12000&subject=TEST')
            .expect(400);
    });

    it('should return an error for invalid email', async () => {
        await request(getApp()).get('/api/ratings?email=notaninstructor@purdue.edu')
            .expect(400);
    });

    it('should return an error for invalid limit', async () => {
        await request(getApp()).get('/api/ratings?courseID=10100&subject=TEST&limit=-1')
            .expect(400);
    });

    it('should return an error for invalid skip', async () => {
        await request(getApp()).get('/api/ratings?courseID=10100&subject=TEST&skip=-1')
            .expect(400);
    });
});
