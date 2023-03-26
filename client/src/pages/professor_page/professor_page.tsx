import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiCourse } from '../../types/course-requirements';
import { ApiProfessor } from '../../types/professor';
import { FaArrowLeft } from 'react-icons/fa';
import { Prerequisites } from '../../components/prerequisites/prerequisites';
import { Classes } from '../../components/classes/classes';
import CourseService from '../../services/CourseService';
import ProfessorService from '../../services/ProfessorService';
import { UserCourse } from '../../types/user-course';
import CourseHistoryService from '../../services/CourseHistoryService';

export function Professor() {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [error, setError] = useState('');

    const [professor, setProfessor] = useState<ApiProfessor | null>(null);

    // IDK
    const [userCourses, setUserCourses] = useState<UserCourse[]>([])

    useEffect(() => {
        CourseHistoryService.getCourses()
            .then(res => setUserCourses(res.courses));
    }, [])
    // END 

    useEffect(() => {
        const professor = searchParams.get('professor') ?? '';

        ProfessorService.getProfessor({ professor })
            .then(res => {
                if (!res) {
                    setProfessor(null);
                    setError('Professor not found');
                    return;
                }
                setProfessor(res);
            })
            .catch(err => {
                setError(err?.message ?? err);
            });
    }, [searchParams])

    if (!professor) return (<Layout><div className="text-2xl flex flex-col h-full justify-center items-center">
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
            {professor.name}
        </header>
        <div className="p-4">
            <div><span className="underline">Email:</span> {professor.email}</div>
            <div className="mt-5 underline">Classes:</div>
            <p></p>
            <Classes classes={professor.classes} userCourses={userCourses} />
            <div className="mt-5 underline">Rate my Professor link:</div>
            <div>{professor.rateMyProfessorLink} </div>
        </div>
    </div></Layout>)
}