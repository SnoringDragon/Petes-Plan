import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiCourse } from '../../types/course-requirements';
import { FaArrowLeft } from 'react-icons/fa';
import { Prerequisites } from '../../components/prerequisites/prerequisites';
import CourseService from '../../services/CourseService';
import { UserCourse } from '../../types/user-course';
import CourseHistoryService from '../../services/CourseHistoryService';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import UserService from '../../services/UserService';
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