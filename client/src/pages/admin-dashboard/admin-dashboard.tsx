import { Layout } from '../../components/layout/layout';
import { useEffect } from 'react';
import ScheduledTaskService from '../../services/ScheduledTaskService';
import { AdminTaskStatus } from '../../components/admin-task-status/admin-task-status';
import { AdminUserPanel } from '../../components/admin-user-panel/admin-user-panel';

export function AdminDashboard() {

    return (<Layout>
        <span className="font-bold text-2xl">Admin Dashboard</span>
        <div className="flex flex-col mt-4 gap-3">
            <AdminTaskStatus />
            <AdminUserPanel />
        </div>
    </Layout>)
}
