import { Layout } from '../../components/layout/layout';
import { useEffect, useState } from 'react';
import CourseHistoryService from '../../services/CourseHistoryService';
import { UserCourse } from '../../types/user-course';
import DegreePlanService from '../../services/DegreePlanService';
import { DegreePlan } from '../../types/degree-plan';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import Button from '@material-ui/core/Button';

export function GraduationRequirements() {
    const [userCourses, setUserCourses] = useState<UserCourse[] | null>(null);
    const [degreePlans, setDegreePlans] = useState<DegreePlan[] | null>(null);
    const [run, setRun] = useState(true);
    const [show, setShow] = useState(true);

    useEffect(() => {
        setTimeout(() => setRun(false), 5000);

        CourseHistoryService.getCourses()
            .then(res => setUserCourses(res.courses));
        DegreePlanService.getPlans()
            .then(res => setDegreePlans(res.degreePlans));
    }, [])

    if (userCourses === null || degreePlans === null)
        return <Layout>Loading...</Layout>;

    const degreeCourses = degreePlans.flatMap(deg => deg.degrees)
        .flatMap(deg => deg.requirements);

    const remaining = degreeCourses.filter(course =>
        !userCourses.find(userCourse => userCourse.courseID === course.courseID &&
            userCourse.subject === course.subject && /^[A-B][-+]?|P|S|C+|C$/.test(userCourse.grade)));

    return (<Layout>
        <div className="flex flex-col text-slate-800">
            {remaining.length === 0 && <div className="flex flex-col flex-1 m-4 py-7 px-5 bg-white rounded-md items-center">
                <span className="font-bold text-4xl mb-4">Congratulations!</span>
                <span className="text-xl">You have met all your graduation requirements</span>
                {run && <Confetti />}
            </div>}
        <div className="flex">
            <div className="flex flex-col flex-1 m-4 p-3 px-5 bg-white rounded-md">
                <span className="font-bold text-xl mb-3">Degree Requirements</span>
                {degreeCourses.map((course, i) => <div key={i}  className="mb-2 p-3 bg-gray-200 rounded bg-opacity-25">
                    <Link to={`/course_description?subject=${course.subject}&courseID=${course.courseID}`}>
                        {course.subject} {course.courseID}</Link>
                </div>)}
                <Button onClick={() => setShow(!show)}>
                    Toggle Completed Courses
                </Button>
            </div>
            <div className="flex flex-col flex-1 m-4 p-3 px-5 bg-white rounded-md" style={{visibility: show ? 'visible' : 'hidden' }}>
                <span className="font-bold text-xl mb-3">Completed Courses</span>
                {userCourses.length ? userCourses.map((course, i) => <div key={i}  className="mb-2 p-3 bg-gray-200 rounded bg-opacity-25">
                    <Link to={`/course_description?subject=${course.subject}&courseID=${course.courseID}`}>
                        {course.subject} {course.courseID}</Link>
                </div>) : 'None'}
            </div>
            <div className="flex flex-col flex-1 m-4 p-3 px-5 bg-white rounded-md">
                <span className="font-bold text-xl mb-3">Remaining Courses</span>
                {remaining.length ? remaining.map((course, i) => <div key={i}  className="mb-2 p-3 bg-gray-200 rounded bg-opacity-25">
                    <Link to={`/course_description?subject=${course.subject}&courseID=${course.courseID}`}>
                        {course.subject} {course.courseID}</Link>
                </div>) : 'None'}
            </div>
        </div>
        </div>
    </Layout>)
}