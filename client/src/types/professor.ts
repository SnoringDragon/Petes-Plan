interface AbstractClasses {
    type: string
}

export interface AbstractClassesGroup extends AbstractClasses {
    children: Classes[],
    // if set, this group also requires a certain amount of credits from the courses inside it
    // this requirement must be met alongside the group requirement
    // requiredCredits: number | null
}

export type Classes = ProfessorRequirement | CourseGroupRequirement;

export interface ApiProfessor {
    name: string,
    email: string,
    // MAYBE HAVE TO CHANGE
    classes: Classes
}

export interface ProfessorRequirement extends AbstractClasses {
    type: 'course',
    subject: string,
    courseID: string,
    // full course object may not exist (in the case it was not populated)
    // full course object may also be null (in the case that the course does not exist in the backend,
    //     such as for regional-campus-only courses)
    course?: ApiProfessor | null
    isCorequisite: boolean,
    // D-, C, C+, etc. Can also be S for zero-credit course requirements or P for pass-fail
}

export interface CourseGroupRequirement extends AbstractClasses {
    type: 'classes_group',
    subject: string,
    startCourseID: string,
    endCourseID: string | null,
    isCorequisite: boolean,
    minGrade: string,
    requiredCourses: number | null,
    requiredCredits: number | null
}
