import { AbstractClassesGroup, Classes } from '../../types/professor';
import { Link } from 'react-router-dom';
import { UserCourse } from '../../types/user-course';
import { ProfessorCourse } from '../../types/professor-course';

export function Classes(props: { classes: Classes }) {
    // TODO: better looking prerequisites

    const data = props.classes;

    if (data === null) return (<span>None</span>);

    if (data.type === 'course') {
        //const professorCourse = props.professorCourses.find(course => course.courseID === data.courseID &&
        //course.subject === data.subject);

        // const satisfied = (userCourse?.grade === data.minGrade) || (gradeValues[userCourse?.grade ?? ''] >= gradeValues[data.minGrade]);

        return (<span className={`bg-opacity-25`}>
            <Link to={`/course_description?subject=${data.subject}&courseID=${data.courseID}`}>
                {data.subject} {data.courseID}
            </Link>
        </span>);
    }

    return null;
}