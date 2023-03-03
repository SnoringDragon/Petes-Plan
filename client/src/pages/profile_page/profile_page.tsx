import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React, { useEffect, useRef, useState } from 'react';
import UserService from '../../services/UserService';
import { Layout } from '../../components/layout/layout';
import { Link } from 'react-router-dom';

export function Profile_Page() {
    const [userData, setUserData] = useState<{ email: string, name: string } | null>(null);

    useEffect(() => {
        UserService.getUserData().then(data => setUserData(data));
    }, []);

    return (<Layout><div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title="Profile Page" className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <text><u>Name:</u> {userData?.name}</text>
                    <p></p>
                    <text><u><br />Email:</u> {userData?.email}</text>
                    <p></p>
                    <text><u><br />Password:</u> ********</text>
                    <p></p>
                    <Link to='/password-reset'><u>To change your password, click here.</u></Link >
                    <p></p>
                    <Link to='/modify_profile_page'><u><br />To edit profile, click here.</u></Link >
                </div>
            </CardContent>
        </Card>
    </div></Layout>)
}