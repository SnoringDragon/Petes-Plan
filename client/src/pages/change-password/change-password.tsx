import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';

export function ChangePassword() {
    const navigate = useNavigate()
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Card className="-mt-16">
                <CardHeader title="Login" className="text-center bg-zinc-800 text-white" />
                <CardContent>
                    <div className="p-4">
                        <TextField
                            variant="standard"
                            fullWidth
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Password"
                            margin="normal" />
                        <TextField
                            variant="standard"
                            fullWidth
                            id="passwordCheck"
                            type="password"
                            label="Confirm Password"
                            placeholder="passwordCheck"
                            margin="normal" />
                    </div>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={() =>  navigate('/')    }
                        className="w-full">
                        Change Password
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}
