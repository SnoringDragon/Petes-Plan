import { Api } from './Api';
import { Grade } from '../types/grades';

class GradesService extends Api {
    getGrades() {
        return this.get<Grade[]>('/api/grades');
    }

    setGrades(grades: Grade[]) {
        return this.post('/api/grades', grades);
    }
}

export default new GradesService();

