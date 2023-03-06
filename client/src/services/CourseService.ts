import { Api } from './Api';

class CourseService extends Api {
    getCourse(options: { courseID: string, subject: string }) {
        return this.get(`/api/courses/?${new URLSearchParams(options)}`);
    }

    searchCourse(query: string) {
        return this.get(`/api/courses/search?q=${encodeURIComponent(query)}`);
    }
}

export default new CourseService();
