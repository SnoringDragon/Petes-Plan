import { BOILERGRADES_GRADES } from '../../types/boilergrades';
import { Button } from '@material-ui/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Boilergrades(props: { className?: string,
    isCourseLinks?: boolean,
    data: Map<string, { gpa: number, diff: number, grades: Partial<{ [key in keyof typeof BOILERGRADES_GRADES]: number } > }>}) {

    const [isHidden, setHidden] = useState(false);
    const [isShowDetails, setShowDetails] = useState(-1);

    return (<div className={`flex flex-col ${props.className ?? ''}`}>
        <div className="flex items-center mb-2">
            <a className="underline mr-4" target="_blank" href="https://boilergrades.com">Boilergrades:</a>
            {props.data.size > 0 && <Button color="inherit" size="small" variant="outlined" onClick={() => setHidden(!isHidden)}>
                {isHidden ? 'Show' : 'Hide'}
            </Button>}
            {props.data.size === 0 && <span>No boilergrades found</span>}
        </div>
        <div className={`flex flex-col max-h-64 overflow-auto ${isHidden ? 'hidden' : ''}`}>
            {[...props.data].sort(([a], [b]) => a.localeCompare(b)).map(([title, { gpa, diff, grades }], i) => {
                let courseID = '';
                let subject = ''
                if (props.isCourseLinks)
                    [subject, courseID] = title.split(' ');

                return <div key={i} className="flex items-center border border-gray-500" onMouseOver={() => setShowDetails(i)}
                            onMouseOut={() => setShowDetails(-1)}>
                    <div className="w-72 pl-2 flex flex-col" >
                        {props.isCourseLinks ? <Link  to={`/course_description?courseID=${courseID}&subject=${subject}`}>
                            {title}
                        </Link> : <span >{title}</span>}

                        {isShowDetails === i && <span>
                            Average GPA: {gpa.toFixed(2)} ({Math.abs(diff).toFixed(2)} {diff > 0 ? 'above' : 'below'} average)
                        </span>}
                    </div>

                    <div className="flex">
                        {Object.entries(grades).map(([grade, val]) =>
                            <div className="flex flex-col w-16 items-center border-x border-gray-500" key={grade}>
                            <span>{(BOILERGRADES_GRADES as any)[grade]}</span>
                            <span>{(val).toFixed(1)}%</span>
                        </div>)}
                    </div>
            </div>})}
        </div>
    </div>)
}