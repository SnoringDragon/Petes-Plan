import { Api } from './Api';
import {Section} from "../types/course-requirements";

class CourseService extends Api {
    getCourse(options: { courseID: string, subject: string }) {
        return this.get(`/api/courses/?${new URLSearchParams(options)}`);
    }

    getCourseSections(options: { courseID: string, subject: string, semester: string }) {
        return this.get<Section[][][]>(`/api/courses/sections/?${new URLSearchParams(options)}`);
    }

    searchCourse(query: string) {
        return this.get(`/api/courses/search?q=${encodeURIComponent(query)}`);
    }
}

export default new CourseService();
