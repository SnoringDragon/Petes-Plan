import { AbstractClassesGroup, Classes } from '../../types/professor';
import { Link } from 'react-router-dom';
import { UserCourse } from '../../types/user-course';
import { ProfessorCourse } from '../../types/professor-course';

const joinRequirements = (group: AbstractClassesGroup, joiner: JSX.Element | string | null, depth: number, professorCourse: ProfessorCourse[]) => {
    return group.children.map((child, i) => (<span key={`${child.type} ${i} ${depth}`}>
        {i !== 0 && joiner}
        <Classes professorCourses={professorCourse} classes={child} isChild={true} depth={depth + 1} />
    </span>));
};

export function Classes(props: { classes: Classes, professorCourses: ProfessorCourse[], isChild?: boolean, depth?: number }) {
    // TODO: better looking prerequisites

    const data = props.classes;
    const isChild = props.isChild;
    const depth = props.depth ?? 0;

    if (data === null) return (<span>None</span>);

    if (data.type === 'classes_group') { } // TODO FIXME!!!

    if (data.type === 'course') {
        // DOESN'T LOOK RIGHT
        const professorCourse = props.professorCourses.find(course => course.courseID === data.courseID &&
            course.subject === data.subject);

        // const satisfied = (userCourse?.grade === data.minGrade) || (gradeValues[userCourse?.grade ?? ''] >= gradeValues[data.minGrade]);

        return (<span className={`bg-opacity-25`}>
            <Link to={`/course_description?subject=${data.subject}&courseID=${data.courseID}`}>
                {data.subject} {data.courseID}
                {data.isCorequisite && ' [can be taken concurrently]'}
            </Link> minimum grade of
        </span>);
    }

    // return (<span>{isChild && '('}{joinRequirements(data, <b> AND </b>, depth, props.professorCourses)}{isChild && ')'}</span>);
}