import { Api } from './Api';
import { UserCourse } from '../types/user-course';

class CourseHistoryService extends Api {
    getCourses() {
        return this.get<{ courses: UserCourse[] }>('/api/courseHistory')
    }

    addCourses(courses: Omit<UserCourse, '_id'>[]) {
        return this.post('/api/courseHistory/add', { courses });
    }

    deleteCourses(ids: string[]) {
        return this.delete('/api/courseHistory/delete', { _ids: ids });
    }

    modifyCourses(courses: Pick<UserCourse, '_id' | 'grade'>[]) {
        return this.post('/api/courseHistory/modify', { courses });
    }
}

export default new CourseHistoryService();
