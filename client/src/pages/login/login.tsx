import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

export function Login() {
    return (<div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title="Login" className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <TextField
                        fullWidth
                        id="username"
                        type="email"
                        label="Username"
                        placeholder="Username"
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Password"
                        margin="normal"
                    />
                    <Checkbox
                    //handleChange={handleChangeA}
                    //isChecked={isCheckedA}
                    />
                    <text>Remember me</text> 
                    <p></p>
                    <a href='/password-reset'><u>Forgot your password?</u></a >
                </div>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="w-full">
                    Login
                </Button>
            </CardActions>
        </Card>
    </div>)
}
