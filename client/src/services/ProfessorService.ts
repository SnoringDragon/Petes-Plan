import { Api } from './Api';

class ProfessorService extends Api {
    getProfessor(options: { id: string }) {
        return this.get(`/api/instructors/?${new URLSearchParams(options)}`);
    }
}

export default new ProfessorService();
