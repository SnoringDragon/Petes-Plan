import { FaHome, FaCheck, FaCalculator, FaLongArrowAltRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Sidebar() {
    const [expanded, setExpanded] = useState(false);

    const links = [
        {
            to: '/',
            label: 'Dashboard',
            icon: FaHome
        },
        {
            to: '/requirements',
            label: 'Requirements',
            icon: FaCheck
        },
        {
            to: '/calculator',
            label: 'Grade Calculator',
            icon: FaCalculator
        }
    ];

    return (<div className="flex flex-col border-r border-slate-600 p-2 bg-neutral-700">
        <Link to="/">logo</Link>
        {links.map((link, i) => (
            <Link key={i} to={link.to} className="ml-4 mr-2 my-4 flex items-center">
                <link.icon className="w-5 h-5" />
                <div className={`ml-2 overflow-hidden whitespace-nowrap ${expanded ? 'w-auto' : 'w-0'}`}>{link.label}</div>
            </Link>))}
        <FaLongArrowAltRight
            className={`w-5 h-5 self-center mt-auto mb-4 cursor-pointer transition ${expanded ? 'rotate-180' : ''}`}
            onClick={() => setExpanded(!expanded)}/>
    </div>);
}