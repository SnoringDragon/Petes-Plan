import { Api } from './Api';
import { ApiProfessor } from '../types/professor';

class ProfessorService extends Api {
    getProfessor(options: { id: string }) {
        return this.get(`/api/instructors/?${new URLSearchParams(options)}`);
    }

    searchProfessor(query: string) {
        return this.get<ApiProfessor[]>(`/api/instructors/search?q=${encodeURIComponent(query)}`);
    }

    addReview(reviews: { dateSubmitted: string,
                        professor_id: string,
                        course: string,
                        attendanceReq: boolean,
                        rating: number,
                        comment: string,
                        grade: string}) {
    return this.post('/api/instructors/add', { reviews });
    }
}

export default new ProfessorService();
