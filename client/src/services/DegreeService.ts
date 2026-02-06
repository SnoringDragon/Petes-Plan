import { Api } from './Api';
import { Degree } from '../types/degree';

class DegreeService extends Api {
    getDegrees()  {
        return this.get<Degree[]>('/api/degrees');
    }

    getDegree(id: string) {
        return this.get<Degree>('/api/degrees/' + id);
    }
}

export default new DegreeService();
