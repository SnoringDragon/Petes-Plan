import { Api } from './Api';

class ProfessorService extends Api {
    getProfessor(options: { name: string }) {
        return this.get(`/api/professor/?${new URLSearchParams(options)}`);
    }

    searchCourse(query: string) {
        return this.get(`/api/professor/search?q=${encodeURIComponent(query)}`);
    }
}

export default new ProfessorService();
