import { Layout } from '../../components/layout/layout';
import { useEffect } from 'react';
import ScheduledTaskService from '../../services/ScheduledTaskService';
import { AdminTaskStatus } from '../../components/admin-task-status/admin-task-status';

export function AdminDashboard() {

    return (<Layout>
        <span className="font-bold text-2xl">Admin Dashboard</span>
        <div className="flex flex-col mt-4">
            <AdminTaskStatus />
        </div>
    </Layout>)
}