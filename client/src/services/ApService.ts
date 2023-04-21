import { Api } from './Api';
import { ApiAPTest, ApiUserAPTest } from '../types/ap-test';

class ApService extends Api {
    getApTests() {
        return this.get<ApiAPTest[]>('/api/ap-tests/all');
    }

    getUserApTests() {
        return this.get<ApiUserAPTest[]>('/api/ap-tests/');
    }

    modifyUserApTests(body: { score: string, test: string }[]) {
        return this.post('/api/ap-tests', body);
    }
}

export default new ApService();
