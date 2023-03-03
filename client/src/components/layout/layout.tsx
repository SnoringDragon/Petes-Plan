import { PropsWithChildren } from 'react';
import { Sidebar } from '../sidebar/sidebar';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

export function Layout({ children }: PropsWithChildren<{}>) {
    const navigate = useNavigate();

    if (!UserService.isLoggedIn())
        setTimeout(() => navigate('/'), 1);


    return (<div className="flex h-full">
        <Sidebar />
        <div className="p-4 w-full h-full">
            {children}
        </div>
    </div>)
}