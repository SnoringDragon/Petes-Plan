import { ApiCourse, Section } from './course-requirements';

export type UserCourse = {
    _id: string,
    courseID: string,
    grade: string,
    semester: string,
    year: number,
    subject: string,
    section?: Section,
    courseData: ApiCourse & { sections: Section[][][] }
}
