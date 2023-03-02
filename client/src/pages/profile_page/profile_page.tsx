import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React, { useRef, useState } from 'react';
import UserService from '../../services/UserService';

export function Profile_Page() {
    return (<div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title="Profile Page" className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <text><u>Name: </u> Patricia Casaca</text>
                    <p></p>
                    <text><u><br />Email: </u> pmagalha@purdue.edu</text>
                    <p></p>
                    <text><u><br />Password: </u> ******</text>
                    <p></p>
                    <a href='/password-reset'><u>To change your password, click here.</u></a >
                    <p></p>
                    <a href='/modify_profile_page'><u><br />To edit profile, click here.</u></a >
                </div>
            </CardContent>
        </Card>
    </div>)
}