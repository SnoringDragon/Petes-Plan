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
        window.dispatchEvent(new Event('storage'));
    }

    async register(email: string, password: string, name: string) {
        return this.post('/api/user/signup', {
            email, password, name
        });
    }

    async logout() {
        await this.post('/api/user/logout');
        this.clearTokens();
    }

    async verifyEmail(email: string, token: string, password: string) {
        return this.post('/api/user/verifyemail', { email, token, password });
    }

    isLoggedIn() {
        // logged in if token valid
        return this.isValidToken(sessionStorage.getItem('token')
            ?? localStorage.getItem('token'));
    }

    getUserData() {
        return this.get<{ name: string, email: string, isAdmin?: boolean }>('/api/user');
    }

    setUserData(data: { name: string }) {
        return this.put('/api/user/update', data);
    }

    requestReset(email: string) {
        return this.post('/api/user/resetrequest', { email });
    }

    resetPassword(email: string, token: string, password: string) {
        return this.post('/api/user/resetpassword', { email, token, password });
    }

    deleteAccount() {
        return this.delete('/api/user/delete');
    }

    getLocalUserData(): { _id: string, isAdmin: boolean } | null {
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
