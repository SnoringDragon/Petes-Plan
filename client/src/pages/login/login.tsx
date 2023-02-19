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
                    <p> </p>
                    <a href='/sign_up'><u><br />Do not have an account? Sign up here.</u></a >
                    <a href='/dashboard'><u><br />Forgot your password? Click here.<br /></u></a >
                    <Checkbox
                    //handleChange={handleChangeA}
                    //isChecked={isCheckedA}
                    />
                    <text>Stay signed in.</text>
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
/*
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            width: 10,
            margin: `${theme.spacing(0)} auto`
        },
        loginBtn: {
            marginTop: theme.spacing(2),
            flexGrow: 1
        },
        header: {
            textAlign: 'center',
            background: '#212121',
            color: '#fff'
        },
        card: {
            marginTop: theme.spacing(10)
        }
    })
);

export function Login() {
    return (
        <Card className={useStyles().card}>
            <CardHeader className={useStyles().header} title="Login" />
            <CardContent>
                <div>
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
                    <p> </p>
                    <a href='/sign_up'><u>Do not have an account? Sign up here.</u></a >
                </div>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className={useStyles().loginBtn}>
                    Login
                </Button>
            </CardActions>
        </Card>);
}
*/
