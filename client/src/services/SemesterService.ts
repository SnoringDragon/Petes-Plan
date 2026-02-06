import { Api } from './Api';
import { Semester } from '../types/semester';

class SemesterService extends Api {
    getSemesters() {
        return this.get<Semester[]>('/api/semesters')
    }
}

export default new SemesterService();