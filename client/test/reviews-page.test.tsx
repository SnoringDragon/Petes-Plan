import { describe, test, vi, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, queryByText } from '@testing-library/react';

import * as router from 'react-router';
import { MemoryRouter } from 'react-router-dom';
import CourseService from '../src/services/CourseService';
import RatingService from '../src/services/RatingService';

import ratings from './ratings';
import boilergrades from './boilergrades';
import { Course_Description } from '../src/pages/course_description/course_description';
import CourseHistoryService from '../src/services/CourseHistoryService';
import UserService from '../src/services/UserService';
import BoilerGradesService from '../src/services/BoilerGradesService';
import DegreePlanService from '../src/services/DegreePlanService';
import SemesterService from '../src/services/SemesterService';

const navigate = vi.fn();

beforeEach(() => {
    vi.spyOn(router, 'useNavigate')
        .mockImplementation(() => navigate);

});

afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
})


const course = {"_id":"6423b2e93651b3f2c4ab2ba0","courseID":"18000","subject":"CS","attributes":[{"code":"LOWR","name":"Lower Division"}],"description":"Problem solving and algorithms, implementation of algorithms in a high level programming language, conditionals, the iterative approach and debugging, collections of data, searching and sorting, solving problems by decomposition, the object-oriented approach, subclasses of existing classes, handling exceptions that occur when the program is running, graphical user interfaces (GUIs), data stored in files, abstract data types, a glimpse at topics from other CS courses.  Intended primarily for students majoring in computer sciences. Credit cannot be obtained for both CS 18000 and any of 15600, 15800 and 15900. Not open to students with credit in CS 24000.","maxCredits":4,"minCredits":0,"name":"Prob Solving & O-O Programming","requirements":{"children":[{"subject":"MA","courseID":"16100","isCorequisite":true,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"16300","isCorequisite":true,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"16500","isCorequisite":true,"minGrade":"C","type":"course"},{"subject":"MATH","courseID":"16500","isCorequisite":true,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"16700","isCorequisite":true,"minGrade":"C","type":"course"},{"children":[{"subject":"MA","courseID":"22100","isCorequisite":false,"minGrade":"C","type":"course"},{"children":[{"subject":"MA","courseID":"22200","isCorequisite":false,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"16021","isCorequisite":false,"minGrade":"C","type":"course"}],"requiredCredits":null,"type":"or"}],"requiredCredits":null,"type":"and"},{"children":[{"subject":"MA","courseID":"22300","isCorequisite":false,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"22400","isCorequisite":false,"minGrade":"C","type":"course"}],"requiredCredits":null,"type":"and"},{"children":[{"subject":"MA","courseID":"16010","isCorequisite":false,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"16020","isCorequisite":false,"minGrade":"C","type":"course"}],"requiredCredits":null,"type":"and"}],"requiredCredits":null,"type":"or"},"searchCourseID":"CS 18000 CS18000 CS 180 CS180","semesters":[{"_id":"640ae7c4c14c81559cf4da19","semester":"Summer","year":2023,"__v":0,"term":"202330"},{"_id":"640af0d8c14c81559cf52e6d","semester":"Spring","year":2023,"__v":0,"term":"202320"},{"_id":"640af18fc14c81559cf58fd6","semester":"Fall","year":2022,"__v":0,"term":"202310"},{"_id":"640af190c14c81559cf58fd8","semester":"Summer","year":2022,"__v":0,"term":"202230"},{"_id":"640af191c14c81559cf58fdb","semester":"Spring","year":2022,"__v":0,"term":"202220"},{"_id":"640af192c14c81559cf58fdd","semester":"Fall","year":2021,"__v":0,"term":"202210"},{"_id":"640af193c14c81559cf58fdf","semester":"Summer","year":2021,"__v":0,"term":"202130"},{"_id":"640af194c14c81559cf58fe2","semester":"Spring","year":2021,"__v":0,"term":"202120"},{"_id":"640af195c14c81559cf58fe4","semester":"Fall","year":2020,"__v":0,"term":"202110"},{"_id":"640af196c14c81559cf58fe7","semester":"Summer","year":2020,"__v":0,"term":"202030"},{"_id":"640af197c14c81559cf58fe9","semester":"Spring","year":2020,"__v":0,"term":"202020"},{"_id":"640af198c14c81559cf58fec","semester":"Fall","year":2019,"__v":0,"term":"202010"},{"_id":"640af199c14c81559cf58fee","semester":"Summer","year":2019,"__v":0,"term":"201930"},{"_id":"640af199c14c81559cf58ff0","semester":"Spring","year":2019,"__v":0,"term":"201920"},{"_id":"640af19ac14c81559cf58ff3","semester":"Fall","year":2018,"__v":0,"term":"201910"},{"_id":"640af19bc14c81559cf58ff5","semester":"Summer","year":2018,"__v":0,"term":"201830"},{"_id":"640af19cc14c81559cf58ff7","semester":"Spring","year":2018,"__v":0,"term":"201820"},{"_id":"642239133651b3f2c4a58500","semester":"Fall","year":2023,"__v":0,"term":"202410"}]};


describe('Review page tests', async () => {
    test('Displays reviews', async () => {
        vi.spyOn(UserService, 'isLoggedIn').mockReturnValue(true);

        vi.spyOn(CourseService, 'getCourse')
            .mockReturnValue(Promise.resolve(course));

        vi.spyOn(RatingService, 'getRatings')
            .mockReturnValue(Promise.resolve(ratings as any));


        vi.spyOn(CourseHistoryService, 'getCourses')
            .mockReturnValue(Promise.resolve({ courses: [] }))
        vi.spyOn(CourseHistoryService, 'cachedGetCourses')
            .mockReturnValue(Promise.resolve({ courses: [] }))

        vi.spyOn(BoilerGradesService, 'getCourse')
            .mockReturnValue(Promise.resolve(boilergrades as any));

        vi.spyOn(DegreePlanService, 'cachedGetPlans')
            .mockReturnValue(Promise.resolve({ degreePlans: [] }))

        vi.spyOn(SemesterService, 'getSemesters')
            .mockReturnValue(Promise.resolve([]))

        render(<MemoryRouter initialEntries={['?courseID=18000&subject=CS']}>
            <Course_Description />
        </MemoryRouter>);


        const count = await screen.findByText(/\bOverall quality based on\b/);
        expect(+count.textContent.match(/\d+/)?.[0] as number).eq(ratings.data.length);

        expect(await screen.queryByText('Rating Distribution')).not.eq(null);
        expect(await screen.queryByText('Difficulty Distribution')).not.eq(null);

        const collapse = await screen.findByText('Collapse Reviews');
        let i = -1;
        collapse.parentNode.childNodes.forEach((val, j) => {
            if (val === collapse)
                i = j;
        })
        const reviewContainer = collapse.parentNode.childNodes.item(i + 1);

        expect(reviewContainer.childNodes.length).eq(ratings.data.length)

        expect(await screen.queryByText(/Boilergrades/)).not.eq(null);

        expect(await screen.queryByText(new RegExp(boilergrades[0].instructor.firstname))).not.eq(null);
    });
});
