import { Api } from './Api';
import jwtDecode from 'jwt-decode';

class UserService extends Api {
    async login(email: string, password: string, remember = false) {
        const result = await this.post<{ token: string, storage: 'session' | 'local' }>('/api/user/login',
            { email, password, remember });
        if (result.storage === 'session')
            sessionStorage.setItem('token', result.token);
        else
            localStorage.setItem('token', result.token);
    }

    async logout() {
        return this.post('/api/user/logout');
    }

    isLoggedIn() {
        // logged in if token valid
        return this.isValidToken(sessionStorage.getItem('token')
            ?? localStorage.getItem('token'));
    }

    getLocalUserData() {
        try {
            // try to decode token payload
            return jwtDecode((sessionStorage.getItem('token')
                ?? localStorage.getItem('token'))!);
        } catch {
            return null;
        }
    }
}

export default new UserService();
