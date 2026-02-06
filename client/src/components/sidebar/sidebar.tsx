import {
    FaHome,
    FaCheck,
    FaCalculator,
    FaLongArrowAltRight,
    FaSearch,
    FaHistory,
    FaAppleAlt,
    FaPencilAlt,
    FaCalendar
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logoUrl from '../../assets/purduepete-transparent.png';

export function Sidebar() {
    const [expanded, setExpanded] = useState(false);

    const links = [
        {
            to: '/',
            label: 'Dashboard',
            icon: FaHome
        },
        {
            to: '/course-search',
            label: 'Course Search',
            icon: FaSearch
        },
        {
            to: '/class-history',
            label: 'Class History',
            icon: FaHistory
        },
        {
            to: '/ap_class',
            label: 'AP Grades',
            icon: FaPencilAlt
        },
        {
            to: '/grade-calc',
            label: 'Grade Calculator',
            icon: FaCalculator
        },
        {
            to: '/calendar',
            label: 'Calendar',
            icon: FaCalendar
        }
    ];

    return (<div className="flex flex-col border-r border-slate-600 p-2 bg-neutral-700">
        <Link to="/"><img className="w-16" src={logoUrl} /></Link>
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
