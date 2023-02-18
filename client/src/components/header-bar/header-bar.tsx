import { Link } from 'react-router-dom';

export function HeaderBar() {
    return (<div className="h-16 p-4 flex items-center border-b border-slate-600 bg-neutral-700">
        title
        <div className="ml-auto flex">
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
        </div>
    </div>);
}