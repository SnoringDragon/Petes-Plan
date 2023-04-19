import { ApiProfessor } from './professor';
import { ApiCourse, Section } from './course-requirements';
import { Semester } from './semester';

export type Boilergrade = {
    _id: string,
    instructor: ApiProfessor,
    section: Section,
    course: ApiCourse,
    semester: Semester,
    gpa: [number, number][] | null,
    grades: [string, number][]
};
