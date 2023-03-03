import { Layout } from '../../components/layout/layout';
import { TextField } from '@material-ui/core';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { ApiCourse } from '../../types/course-requirements';
import CourseService from '../../services/CourseService';
import { Link, useSearchParams } from 'react-router-dom';

export function CourseSearch() {
    const [courses, setCourses] = useState<ApiCourse[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const search = () => {
        CourseService.searchCourse(searchParams.get('q') ?? '')
            .then(res => setCourses(res));
    };

    useEffect(search, []);

    return (<Layout><div>
        <div className="flex items-center mb-4">
            <TextField className="flex-grow" label="Search" variant="standard" value={searchParams.get('q')}
                       onChange={ev => setSearchParams({ q: ev.target.value })}
                       onKeyDown={ev => ev.key === 'Enter' && search()} />
            <FaSearch className="ml-6 mr-2 cursor-pointer" onClick={search} />
        </div>
        <div className="border-x border-gray-500 rounded flex flex-col">
        {courses.map((course, i) => (<Link to={`/course_description?subject=${course.subject}&courseID=${course.courseID}`}
            className="w-full py-3 px-4 bg-gray-600 border-y border-gray-500 cursor-pointer" key={i}>
            {course.subject} {course.courseID}: {course.name}
        </Link>))}
        </div>
    </div></Layout>);
}
