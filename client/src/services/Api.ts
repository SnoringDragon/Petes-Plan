import jwtDecode from 'jwt-decode';

export abstract class Api {
    protected isValidToken(token: string | null) {
        try {
            const { exp } = jwtDecode(token!) as { exp: number };
            return exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    protected async get<T=any>(input: RequestInfo | URL) : Promise<T> {
        return this.fetch(input);
    }

    protected async delete<T=any>(input: RequestInfo | URL) : Promise<T> {
        return this.fetch(input, { method: 'DELETE' });
    }

    protected async post<T=any>(input: RequestInfo | URL, body: any = {}) : Promise<T> {
        return this.fetch(input, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }

    protected async put<T=any>(input: RequestInfo | URL, body: any = {}) : Promise<T> {
        return this.fetch(input, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }

    protected async fetch(input: RequestInfo | URL, init?: RequestInit) {
        const localToken = localStorage.getItem('token');
        const sessionToken = sessionStorage.getItem('token');
        let token = '';

        // validate stored token is still valid
        if (localToken) {
            if (this.isValidToken(localToken))
                token = localToken;
            else
                localStorage.removeItem('token');
        }

        // try to use session token instead
        if (!token && sessionToken) {
            if (this.isValidToken(sessionToken))
                token = sessionToken;
            else
                sessionStorage.removeItem('token');
        }

        // add authorization header
        if (token) {
            init ??= {};

            init.headers = {
                ...init.headers,
                'Authorization': `Bearer ${token}`
            };
        }

        const result = await fetch(new URL(input.toString(), import.meta.env.VITE_API_URL), init);

        // session bad or expired, remove token
        if (result.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
        }

        const data = await result.json();

        if (result.ok)
            return data;
        throw data;
    }
}
