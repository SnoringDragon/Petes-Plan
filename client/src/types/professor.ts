interface AbstractClasses {
    type: string
}

/*
export interface AbstractClassesGroup extends AbstractClasses {
    children: Classes[],
    // if set, this group also requires a certain amount of credits from the courses inside it
    // this requirement must be met alongside the group requirement
    // requiredCredits: number | null
}
*/
//export type Classes = ProfessorRequirement;

export interface ApiProfessor {
    _id: string,
    firstname: string,
    lastname: string,
    email: string,
    //classes: Classes
    rateMyProfId: string[]
}

/*
export interface ProfessorRequirement extends AbstractClasses {
    type: 'course',
    subject: string,
    courseID: string,
    // full course object may not exist (in the case it was not populated)
    // full course object may also be null (in the case that the course does not exist in the backend,
    //     such as for regional-campus-only courses)
    course?: ApiProfessor | null
}
*/

