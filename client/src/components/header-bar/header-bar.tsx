import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { Button } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';

export function HeaderBar() {
    const [isLoggedIn, setLoggedIn] = useState(UserService.isLoggedIn());
    const [isAdmin, setAdmin] = useState(UserService.getLocalUserData()?.isAdmin);

    useEffect(() => {
        const handleEvent = () => {
            setLoggedIn(UserService.isLoggedIn());
            setAdmin(UserService.getLocalUserData()?.isAdmin);
        };

        window.addEventListener('storage', handleEvent);

        return () => {
            window.removeEventListener('storage', handleEvent)
        };
    }, []);


    const navigate = useNavigate();

    return (<div className="h-16 p-4 flex items-center border-b border-slate-600 bg-neutral-700">
        Pete's Plan
        {isLoggedIn && <div className="ml-auto flex">
            {isAdmin && <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>}
            <Button color="inherit" onClick={() => {
                UserService.logout().then(() => navigate('/login'))
            }}>Logout</Button>
            <Button color="inherit" onClick={() => navigate('/profile_page')}>Profile</Button>
        </div>}
    </div>);
}