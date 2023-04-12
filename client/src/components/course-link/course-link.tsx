import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { UserCourse } from '../../types/user-course';
import { DegreePlan } from '../../types/degree-plan';
import { makePromiseCache } from '../../utils/promise-cache';
import DegreePlanService from '../../services/DegreePlanService';
import CourseService from '../../services/CourseService';
import CourseHistoryService from '../../services/CourseHistoryService';
import { ApiCourse } from '../../types/course-requirements';
import { CircularProgress, Tooltip } from '@material-ui/core';
import { Prerequisites } from '../prerequisites/prerequisites';

const getPlans = makePromiseCache(DegreePlanService.getPlans.bind(DegreePlanService));
const getUserCourses = makePromiseCache(CourseHistoryService.getCourses.bind(CourseHistoryService));

let gradeValues: { [key: string]: number } = {
    'D-': 1, 'D': 2, 'D+': 3, 'C-': 4, 'C': 5, 'C+': 6, 'B-': 7, 'B': 8, 'B+': 9, 'A-': 10, 'A': 11, 'A+': 12
};

export function CourseLink(props: { courseID: string, subject: string,
    className?: string, useColor?: boolean, minGrade?: string, useTooltip?: boolean }) {
    const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
    const [degreePlans, setDegreePlans] = useState<DegreePlan[]>([]);
    const [course, setCourse] = useState<ApiCourse | null>();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hovering, setHoveringArray] = useState([false, false, false]);

    const setHovering = (i: number, hovering: boolean) =>
        setHoveringArray(arr => arr.map((val, j) => j === i ? hovering : val));

    const minGrade = props.minGrade ?? 'C-';

    useEffect(() => {
        if (!('useColor' in props) || props.useColor) {
            getPlans().then(res => setDegreePlans(res.degreePlans));
            getUserCourses().then(res => setUserCourses(res.courses));
        }
    }, [props.useColor]);

    useEffect(() => {
        setCourse(null);
    }, [props.courseID, props.subject])

    const getCourse = useCallback(() => {
        CourseService.getCourse({courseID: props.courseID, subject: props.subject})
            .then(res => setCourse(res))
            .catch(err => setError(err?.message ?? err))
    }, [props.courseID, props.subject]);

    let color = '';

    const yr = new Date().getFullYear();

    if (!('useColor' in props) || props.useColor) {
        const userCourse = userCourses.filter(course => course.courseID === props.courseID &&
            course.subject === props.subject);

        const satisfied = userCourse.some(course => course.grade === minGrade ||
            course.grade === 'P' ||
            gradeValues[course.grade] >= gradeValues[minGrade]);

        let current = false;
        let planned = false;

        if (!satisfied) {
            const mon = new Date().getMonth();
            let month;

            if (mon > 7 && mon < 13) {
                month = "Fall";
            } else if (mon < 5 && mon > 0) {
                month = "Spring";
            } else if (mon > 4 && mon < 8) {
                month = "Summer";
            } else {
                month = "Winter";
            }

            for (const plan of degreePlans) {
                for (const course of plan.courses) {
                    if (props.courseID === course.courseID
                        && props.subject === course.subject) {
                        planned = true;

                        if (course.semester === month && yr === course.year) {
                            current = true;
                            break;
                        }
                    }
                }
            }
        }

        if (current) {
            color = 'bg-blue-500';
        } else if (planned) {
            color = 'bg-yellow-500';
        } else if (satisfied) {
            color = 'bg-green-500';
        } else {
            color = 'bg-red-500';
        }
    }

    const useTooltip = !('useTooltip' in props) || props.useTooltip !== false;

    if (hovering.some(x => x) && !course && !error && !loading && useTooltip) {
        setLoading(true);
        getCourse();
    }

    const semesters = course?.semesters.filter(sem => sem.year >= yr).sort((a, b) => b.term.localeCompare(a.term));

    return (<Tooltip classes={{ tooltip: 'max-w-lg' }} open={useTooltip && hovering.some(x => x)} disableFocusListener disableHoverListener disableTouchListener
                     title={<>
             <div onMouseEnter={() => setHovering(0, true)} onMouseLeave={() => setHovering(0, false)}
                     className="text-base pointer-events-auto">
                 {loading && !error && !course && <div className="p-2 pt-3"><CircularProgress color="inherit" /></div>}
                 {!course && error && <div className="text-red-400 p-1.5">Error: {error}</div>}
                 {course && <div className="flex flex-col p-1.5">
                     <Link to={`/course_description?subject=${props.subject}&courseID=${props.courseID}`} className="text-lg">
                         {course.subject} {course.courseID}: {course.name}
                     </Link>
                     <span className="my-1">
                         <u>Credit Hours:</u> {course.minCredits === course.maxCredits ? course.minCredits : `${course.minCredits} to ${course.maxCredits}`}
                     </span>
                     <span>{course.description}</span>
                     <span className="underline mt-1">Prerequisites: </span><Prerequisites useTooltip={false} prerequisites={course.requirements}  />
                     <span className="mt-1"><u>Semester Availability:</u> {semesters?.length ? semesters.map(s => `${s.semester} ${s.year}`).join(', ') : 'none found in future semesters'}</span>
                 </div>}
            </div>
            <div className="absolute left-0 right-0 -bottom-4 h-7 pointer-events-auto"
                 onMouseEnter={() => setHovering(1, true)} onMouseLeave={() => setHovering(1, false)}></div>
         </>} placement="top" arrow className={`inline-block ${props.className ?? ''}`}>
        <Link to={`/course_description?subject=${props.subject}&courseID=${props.courseID}`}
              className={`${color} bg-opacity-25`} onMouseEnter={() => setHovering(2, true)} onMouseLeave={() => setHovering(2, false)}>
            {props.subject} {props.courseID}
        </Link>
    </Tooltip>);
}
