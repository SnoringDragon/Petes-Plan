import { AbstractRequirementGroup, Requirement } from '../../types/course-requirements';
import { Link } from 'react-router-dom';

const joinRequirements = (group: AbstractRequirementGroup, joiner: JSX.Element | string | null) => {
    return group.children.map((child, i) => (<>
        {i !== 0 && joiner}
        <Prerequisites key={i} prerequisites={child} isChild={true} />
    </>));
};

export function Prerequisites(props: { prerequisites: Requirement, isChild?: boolean }) {
    // TODO: better looking prerequisites

    const data = props.prerequisites;
    const isChild = props.isChild;

    if (data.type === 'course')
        return (<span>
            <Link to={`/course_description?subject=${data.subject}&courseID=${data.courseID}`}>
                {data.subject} {data.courseID}
            </Link> minimum grade of {data.minGrade}
            {data.isCorequisite && ' [can be taken concurrently]'}
        </span>);

    if (data.type === 'and')
        return (<span>{isChild && '('}{joinRequirements(data, <b> AND </b>)}{isChild && ')'}</span>);

    if (data.type === 'or')
        return (<span>{isChild && '('}{joinRequirements(data, <b> OR </b>)}{isChild && ')'}</span>);

    if (data.type === 'pick_n')
        return (<span>Pick {data.n} {data.requiredCredits !== null && `; ${data.requiredCredits} credits required`}: ({joinRequirements(data, <b>OR</b>)})</span>);

    return null;
}