import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React, { useRef, useState } from 'react';
import UserService from '../../services/UserService';

type State = {
    name: string
    email: string
};

const initialState: State = {
    name: "Patricia Casaca",
    email: "pmagalha@purdue.edu"
};

export function Modify_Profile_Page() {
    return (<div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title="Modify Porfile Page" className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <TextField
                        fullWidth
                        id="name"
                        type="name"
                        label={initialState.name}
                        placeholder="name"
                        margin="normal"
                    />
                    <p></p>
                    <text><u><br />Email: </u> {initialState.email}</text>
                    <p></p>
                    <a href='/password-reset'><u><br />To change your password, click here.</u></a >
                </div>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="w-half">
                    Apply Changes
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="w-half">
                    Delete Account
                </Button>
            </CardActions>
        </Card>
    </div>)
}