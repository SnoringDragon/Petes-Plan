import { Api } from './Api';
import { Degree } from '../types/degree';

class DegreeService extends Api {
    getDegrees()  {
        return this.get<Degree[]>('/api/degrees');
    }
}

export default new DegreeService();
