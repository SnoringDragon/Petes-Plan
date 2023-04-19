import { Api } from './Api';
import { User } from '../types/user';

class AdminUserService extends Api {
    getUsers() {
        return this.get<User[]>('/api/admin/user');
    }

    setUserData(opts: { id: string, data: Partial<User> }) {
        return this.post(`/api/admin/user/${encodeURIComponent(opts.id)}`, opts.data);
    }
}

export default new AdminUserService();
