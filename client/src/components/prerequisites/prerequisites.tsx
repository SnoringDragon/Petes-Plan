import { AbstractRequirementGroup, Requirement } from '../../types/course-requirements';
import { Link } from 'react-router-dom';
import { UserCourse } from '../../types/user-course';

let gradeValues: { [key: string]: number } = {
    'D-': 1, 'D': 2, 'D+': 3, 'C-': 4, 'C': 5, 'C+': 6, 'B-': 7, 'B': 8, 'B+': 9, 'A-': 10, 'A': 11, 'A+': 12
};

const joinRequirements = (group: AbstractRequirementGroup, joiner: JSX.Element | string | null, depth: number, userCourses: UserCourse[]) => {
    return group.children.map((child, i) => (<span key={`${child.type} ${i} ${depth}`}>
        {i !== 0 && joiner}
        <Prerequisites userCourses={userCourses} prerequisites={child} isChild={true} depth={depth + 1} />
    </span>));
};

export function Prerequisites(props: { prerequisites: Requirement, userCourses: UserCourse[], isChild?: boolean, depth?: number }) {
    // TODO: better looking prerequisites

    const data = props.prerequisites;
    const isChild = props.isChild;
    const depth = props.depth ?? 0;

    if (data === null) return (<span>None</span>);

    if (data.type === 'course') {
        const userCourse = props.userCourses.find(course => course.courseID === data.courseID &&
            course.subject === data.subject);

        const satisfied = (userCourse?.grade === data.minGrade) || (gradeValues[userCourse?.grade ?? ''] >= gradeValues[data.minGrade]);

        return (<span className={`bg-opacity-25 ${satisfied ? 'bg-green-500' : 'bg-red-500'}`}>
            <Link to={`/course_description?subject=${data.subject}&courseID=${data.courseID}`}>
                {data.subject} {data.courseID}
            </Link> minimum grade of {data.minGrade}
            {data.isCorequisite && ' [can be taken concurrently]'}
        </span>);
    }

    if (data.type === 'and')
        return (<span>{isChild && '('}{joinRequirements(data, <b> AND </b>, depth, props.userCourses)}{isChild && ')'}</span>);

    if (data.type === 'or')
        return (<span>{isChild && '('}{joinRequirements(data, <b> OR </b>, depth, props.userCourses)}{isChild && ')'}</span>);

    if (data.type === 'pick_n')
        return (<span>Pick {data.n} {data.requiredCredits !== null && `; ${data.requiredCredits} credits required`}: ({joinRequirements(data, <b>OR</b>, depth, props.userCourses)})</span>);

    if (data.type === 'non_course')
        return (<span>{data.text}</span>);

    if (data.type === 'student_level')
        return (<span>Student Level: {data.level}</span>);

    return null;
}