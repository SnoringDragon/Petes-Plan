export type DegreeRequirementCourse = {
    type: 'course',
    courseID: string,
    subject: string
};

export type DegreeRequirementNonCourse = {
    type: 'non_course',
    text: string
};

export type DegreeRequirementOr = {
    type: 'or',
    groups: (DegreeRequirementCourse | DegreeRequirementCourseRange | DegreeRequirementNonCourse)[]
};

export type DegreeRequirementGroup = {
    type: 'group',
    text: string,
    credits: number,
    description: string | null,
    groups: DegreeRequirement[]
};

export type DegreeRequirementCourseRange = {
    type: 'course_range',
    courseStart: number,
    courseEnd: number,
    subject: string
};

export type DegreeRequirement =
    DegreeRequirementCourse | DegreeRequirementOr | DegreeRequirementGroup | DegreeRequirementNonCourse;

export type Degree = {
    _id: string,
    name: string,
    type: 'concentration' | 'minor' | 'major' | 'certificate',
    requirements: DegreeRequirementGroup[],
    concentrations: Degree[],
    info: string,
    link: string,
    requiredCredits: number,
};
