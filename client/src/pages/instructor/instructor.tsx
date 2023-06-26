import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Card, CardContent, CardHeader } from '@mui/material/';
import { Link } from 'react-router-dom';

export function Instructor() {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [error, setError] = useState('');

    return (<div className="w-full h-full flex items-center justify-center">
    <Card className="-mt-16">
        <CardHeader title="Insert Prof Name" className="text-center bg-zinc-800 text-white" />
        <CardContent>
            <div className="flex">
                        <Link to="https://www.ratemyprofessors.com/professor/2231495" className="mr-auto">RateMyProfessor Link</Link>
            </div>
            <br></br>
            <text>RateMyProfessor Ranking: </text>
            <br></br>
            <br></br>
            <div className="flex">
                        <Link to="https://www.boilergrades.com/" className="mr-auto">BoilerGrades Link</Link>
            </div>
            <br></br>
            <text>BoilerGrades Spread: </text>
        </CardContent>
        </Card>
        </div>
        )
}