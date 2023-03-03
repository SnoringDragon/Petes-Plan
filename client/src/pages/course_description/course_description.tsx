import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiCourse } from '../../types/course-requirements';
import { FaArrowLeft } from 'react-icons/fa';
import { Prerequisites } from '../../components/prerequisites/prerequisites';

export function Course_Description() {
    const [searchParams] = useSearchParams();
    const subject = searchParams.get('subject');
    const courseID = searchParams.get('courseID');

    const navigate = useNavigate();

    const [error, setError] = useState('');

    const [course, setCourse] = useState<ApiCourse | null>(null);

    useEffect(() => {
        // TODO: fetch course here from backend
        setCourse({"courseID":"18000","subject":"CS","attributes":[{"code":"LOWR","name":"Lower Division"}],"description":"Problem solving and algorithms, implementation of algorithms in a high level programming language, conditionals, the iterative approach and debugging, collections of data, searching and sorting, solving problems by decomposition, the object-oriented approach, subclasses of existing classes, handling exceptions that occur when the program is running, graphical user interfaces (GUIs), data stored in files, abstract data types, a glimpse at topics from other CS courses.  Intended primarily for students majoring in computer sciences. Credit cannot be obtained for both CS 18000 and any of 15600, 15800 and 15900. Not open to students with credit in CS 24000.","maxCredits":4,"minCredits":0,"name":"Prob Solving & O-O Programming","requirements":{"children":[{"subject":"MA","courseID":"16100","isCorequisite":true,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"16300","isCorequisite":true,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"16500","isCorequisite":true,"minGrade":"C","type":"course"},{"subject":"MATH","courseID":"16500","isCorequisite":true,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"16700","isCorequisite":true,"minGrade":"C","type":"course"},{"children":[{"subject":"MA","courseID":"22100","isCorequisite":false,"minGrade":"C","type":"course"},{"children":[{"subject":"MA","courseID":"22200","isCorequisite":false,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"16021","isCorequisite":false,"minGrade":"C","type":"course"}],"requiredCredits":null,"type":"or"}],"requiredCredits":null,"type":"and"},{"children":[{"subject":"MA","courseID":"22300","isCorequisite":false,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"22400","isCorequisite":false,"minGrade":"C","type":"course"}],"requiredCredits":null,"type":"and"},{"children":[{"subject":"MA","courseID":"16010","isCorequisite":false,"minGrade":"C","type":"course"},{"subject":"MA","courseID":"16020","isCorequisite":false,"minGrade":"C","type":"course"}],"requiredCredits":null,"type":"and"}],"requiredCredits":null,"type":"or"}});
    }, [])

    if (!course) return (<Layout><div className="text-2xl flex flex-col h-full justify-center items-center">
        Loading...
        {error && <>
            <div className="text-xl text-red-500 mt-4">Error: {error}</div>
            <a className="text-sm mt-2 cursor-pointer" onClick={() => navigate(-1)}>Go back</a>
        </>}
    </div></Layout>)

    return (<Layout><div className="w-full h-full flex flex-col items-center">
        <header className="text-center text-white text-3xl mt-4 w-full">
            <div className="float-left ml-2 text-2xl cursor-pointer" onClick={() => navigate(-1)}>
                <FaArrowLeft />
            </div>
            {course.subject} {course.courseID}
        </header>
        <div className="p-4">
            <div><u>Credit Hours:</u> {course.minCredits === course.maxCredits ?
                course.minCredits :
                `${course.minCredits} to ${course.maxCredits}`}</div>
            <p></p>
            <div><u><br />Course Description:</u></div>
            <p></p>
            <div>{course.description} </div>
            {/*<p> </p>*/}
            {/*<text><u><br />Class Type:</u></text>*/}
            {/*<p></p>*/}
            {/*<text>{initialState.class_type.split('\n').map(str => <p>{str}</p>)}</text>*/}
            {/*<p></p>*/}
            {/*<text><u><br />Semester(s) offered:</u></text>*/}
            {/*<p></p>*/}
            {/*<text>{initialState.semester.split('\n').map(str => <p>{str}</p>)} </text>*/}
            {/*<p></p>*/}
            {/*<text><u><br />Restrictions:</u></text>*/}
            {/*<p></p>*/}
            {/*<text>{initialState.restrictions.split('\n').map(str => <p>{str}</p>)}</text>*/}
            <p></p>
            <div><u><br />Prerequisities:</u></div>
            <p></p>
            <Prerequisites prerequisites={course.requirements} />
        </div>
    </div></Layout>)
}