interface AbstractRequirement {
    type: string
}

export interface AbstractRequirementGroup extends AbstractRequirement {
    children: Requirement[],
    // if set, this group also requires a certain amount of credits from the courses inside it
    // this requirement must be met alongside the group requirement
    requiredCredits: number | null
}

export type Requirement = AndRequirement | OrRequirement | PickNRequirement |
    CourseRequirement | CourseGroupRequirement | NonCourseRequirement | StudentLevel;

export type Professor = ProfessorRequirement;

export interface AndRequirement extends AbstractRequirementGroup {
    type: 'and'
}

export interface OrRequirement extends AbstractRequirementGroup {
    type: 'or'
}

export interface PickNRequirement extends AbstractRequirementGroup {
    type: 'pick_n',
    // pick n from this group
    n: number
}

export interface ApiCourse {
    name: string,
    subject: string,
    courseID: string,
    minCredits: number,
    maxCredits: number,
    attributes: { code: string, name: string }[],
    description: string,
    professors: Professor,
    requirements: Requirement
}

export interface CourseRequirement extends AbstractRequirement {
    type: 'course',
    subject: string,
    courseID: string,
    // full course object may not exist (in the case it was not populated)
    // full course object may also be null (in the case that the course does not exist in the backend,
    //     such as for regional-campus-only courses)
    course?: ApiCourse | null
    isCorequisite: boolean,
    // D-, C, C+, etc. Can also be S for zero-credit course requirements or P for pass-fail
    minGrade: string
}

export interface ProfessorRequirement {
    type: 'professor',
    name: string,
    // full course object may not exist (in the case it was not populated)
    // full course object may also be null (in the case that the course does not exist in the backend,
    //     such as for regional-campus-only courses)
    // DONT KNOW ABOUT KEEPING THE ApiCourse
    professor?: ApiCourse | null
}

export interface CourseGroupRequirement extends AbstractRequirement {
    type: 'course_group',
    subject: string,
    startCourseID: string,
    endCourseID: string | null,
    isCorequisite: boolean,
    minGrade: string,
    requiredCourses: number | null,
    requiredCredits: number | null
}

export interface NonCourseRequirement extends AbstractRequirement {
    type: 'non_course',
    text: string
}

export interface StudentLevel extends AbstractRequirement {
    type: 'student_level',
    level: 'graduate' | 'professional'
}
