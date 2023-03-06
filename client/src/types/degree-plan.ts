import { Degree } from './degree';
import { UserCourse } from './user-course';

export type DegreePlan = {
    name: string,
    _id: string,
    degrees: Degree[],
    courses: UserCourse[]
};
