import { PropsWithChildren, useEffect } from 'react';
import { Sidebar } from '../sidebar/sidebar';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

export function Layout({ children }: PropsWithChildren<{}>) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!UserService.isLoggedIn())
            navigate('/login');
    }, []);

    return (<div className="flex flex-1 bg-zinc-700 text-slate-200">
        <Sidebar />
         <div className="p-4 w-full">
            {children}
        </div>
    </div>)
}