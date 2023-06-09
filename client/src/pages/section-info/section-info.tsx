import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiCourse } from '../../types/course-requirements';
import { FaArrowLeft } from 'react-icons/fa';
import { Prerequisites } from '../../components/prerequisites/prerequisites';
import CourseService from '../../services/CourseService';
import { UserCourse } from '../../types/user-course';
import CourseHistoryService from '../../services/CourseHistoryService';

export function Section_Info() {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [error, setError] = useState('');

    {/*const [course, setCourse] = useState<ApiCourse | null>(null);

    const [userCourses, setUserCourses] = useState<UserCourse[]>([])

    useEffect(() => {
        CourseHistoryService.getCourses()
            .then(res => setUserCourses(res.courses));
    }, [])

    useEffect(() => {
        const subject = searchParams.get('subject') ?? '';
        const courseID = searchParams.get('courseID') ?? '';

        CourseService.getCourse({ subject, courseID })
            .then(res => {
                if (!res) {
                    setCourse(null);
                    setError('Course not found');
                    return;
                }
                setCourse(res);
            })
            .catch(err => {
                setError(err?.message ?? err);
            });
    }, [searchParams])

    if (!course) return (<Layout><div className="text-2xl flex flex-col h-full justify-center items-center">
        Loading...
        {error && <>
            <div className="text-xl text-red-500 mt-4">Error: {error}</div>
            <a className="text-sm mt-2 cursor-pointer" onClick={() => navigate(-1)}>Go back</a>
        </>}
        </div></Layout>)*/}

    return (<Layout><div className="w-full h-full flex flex-col items-center">
        <header className="text-center text-white text-3xl mt-4 w-full">
            <div className="float-left ml-2 text-2xl cursor-pointer" onClick={() => navigate(-1)}>
                <FaArrowLeft />
            </div>
            {/*course.subject} {course.courseID}: {course.name*/} Sections
        </header>
        <div className="p-4">
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
        </div>
    </div></Layout>)
}