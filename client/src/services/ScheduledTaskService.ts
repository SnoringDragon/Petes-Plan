import { Api } from './Api';
import { ScheduledTask } from '../types/scheduled-task';

class ScheduledTaskService extends Api {
    getScheduledTasks() {
        return this.get<ScheduledTask[]>('/api/admin/scheduled-task');
    }

    abortTask(body: { id: string }) {
        return this.post('/api/admin/scheduled-task/abort', body);
    }

    runTask(body: { id: string, force?: boolean }) {
        return this.post('/api/admin/scheduled-task/run', body);
    }

    rescheduleTask(body: { id: string, time: string }) {
        return this.post('/api/admin/scheduled-task/reschedule', body);
    }

    getScheduledTasksEvent() {
        // move token to cookies since eventsource does not support adding authorization header
        // document.cookie = `token=${localStorage.getItem('token') ?? sessionStorage.getItem('token')}; path=/`;

        // cookies are unreliable on 127.0.0.1, use token query instead
        const source = new EventSource(new URL(`/api/admin/scheduled-task/events?token=${encodeURIComponent(localStorage.getItem('token') ??
            sessionStorage.getItem('token') ?? '')}`, import.meta.env.VITE_API_URL), {
            withCredentials: true
        });

        const onOpen = () => {
            // document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        };

        source.addEventListener('open', onOpen);

        source.addEventListener('error', () => {
            // document.cookie = `token=${localStorage.getItem('token') ?? sessionStorage.getItem('token')}; path=/`;
        });

        return source;
    }
}

export default new ScheduledTaskService();
