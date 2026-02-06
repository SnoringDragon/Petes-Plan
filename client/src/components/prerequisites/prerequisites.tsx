import { AbstractRequirementGroup, Requirement } from '../../types/course-requirements';
import { Link } from 'react-router-dom';
import { UserCourse } from '../../types/user-course';
import React, { useReducer, useEffect, useState } from 'react';
import DegreePlanService from '../../services/DegreePlanService';
import { DegreePlan } from '../../types/degree-plan';
import { CourseLink } from '../course-link/course-link';

const joinRequirements = (group: AbstractRequirementGroup, joiner: JSX.Element | string | null, depth: number, useTooltip?: boolean) => {
    return group.children.map((child, i) => (<span key={`${child.type} ${i} ${depth}`}>
        {i !== 0 && joiner}
        <Prerequisites prerequisites={child} isChild={true} depth={depth + 1} useTooltip={useTooltip} />
    </span>));
};

export function Prerequisites(props: { prerequisites: Requirement, isChild?: boolean, depth?: number, useTooltip?: boolean }) {
    // TODO: better looking prerequisites

    const data = props.prerequisites;
    const isChild = props.isChild;
    const depth = props.depth ?? 0;

    if (data === null) return (<span>None</span>);

    if (data.type === 'course_group') { } // TODO FIXME!!!

    if (data.type === 'course') {
        return (<span>
            <CourseLink useTooltip={props.useTooltip} courseID={data.courseID} subject={data.subject}></CourseLink> minimum grade of {data.minGrade}
            {data.isCorequisite && ' [can be taken concurrently]'}
        </span>);
    }

    if (data.type === 'and')
        return (<span>{isChild && '('}{joinRequirements(data, <b> AND </b>, depth, props.useTooltip)}{isChild && ')'}</span>);

    if (data.type === 'or')
        return (<span>{isChild && '('}{joinRequirements(data, <b> OR </b>, depth, props.useTooltip)}{isChild && ')'}</span>);

    if (data.type === 'pick_n')
        return (<span>Pick {data.n} {data.requiredCredits !== null && `; ${data.requiredCredits} credits required`}: ({joinRequirements(data, <b>OR</b>, depth, props.useTooltip)})</span>);

    if (data.type === 'non_course')
        return (<span>{data.text}</span>);

    if (data.type === 'student_level')
        return (<span>Student Level: {data.level}</span>);

    return null;
}

