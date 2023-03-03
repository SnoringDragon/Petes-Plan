import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { Button } from '@material-ui/core';

export function HeaderBar() {
    const isLoggedIn = UserService.isLoggedIn();
    const navigate = useNavigate();

    return (<div className="h-16 p-4 flex items-center border-b border-slate-600 bg-neutral-700">
        Pete's Plan
        {isLoggedIn && <div className="ml-auto flex">
            <Button color="inherit" onClick={() => {
                UserService.logout().then(() => navigate('/'))
            }}>Logout</Button>
            <Button color="inherit" onClick={() => navigate('/profile_page')}>Profile</Button>
        </div>}
    </div>);
}