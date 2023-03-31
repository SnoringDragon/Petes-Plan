import { BOILERGRADES_GRADES } from '../../types/boilergrades';
import { Button } from '@material-ui/core';
import { useState } from 'react';

export function Boilergrades(props: { className?: string,
    isCourse?: boolean,
    data: Map<string, Partial<{ [key in keyof typeof BOILERGRADES_GRADES]: number }>> }) {

    const [isHidden, setHidden] = useState(false);

    return (<div className="flex flex-col">
        <div className="flex items-center mb-2">
            <span className="underline mr-4">Boilergrades:</span>
            {props.data.size > 0 && <Button color="inherit" size="small" variant="outlined" onClick={() => setHidden(!isHidden)}>
                {isHidden ? 'Show' : 'Hide'}
            </Button>}
            {props.data.size === 0 && <span>No boilergrades found</span>}
        </div>
        <div className={`flex flex-col h-64 overflow-auto ${isHidden ? 'hidden' : ''}`}>
            {[...props.data].sort(([a], [b]) => a.localeCompare(b)).map(([title, grades], i) =>
                <div key={i} className="flex items-center border border-gray-500">
                <span className="w-64 pl-2">{title}</span>
                    <div className="flex">
                        {Object.entries(grades).map(([grade, val]) =>
                            <div className="flex flex-col w-16 items-center border-x border-gray-500" key={grade}>
                            <span>{(BOILERGRADES_GRADES as any)[grade]}</span>
                            <span>{(val).toFixed(1)}%</span>
                        </div>)}
                    </div>
            </div>)}
        </div>
    </div>)
}