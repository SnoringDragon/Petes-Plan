import { Layout } from '../../components/layout/layout';
import Button from '../../components/buttonset/buttonset';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();

    return (
        <>
                <Button 
                    border="thick"
                    color="grey"
                    height = "50px"
                    onClick={() =>  navigate('/password-reset')    }
                    radius = "5%"
                    width = "200px"
                    top = "60px"
                    padding="50px"
                    left = "0px"
                    children = "Forgot My Password"
                 />
            </>);
}
/*
import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            width: 400,
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
                    //onChange={handleUsernameChange}
                    //onKeyPress={handleKeyPress}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Password"
                        margin="normal"
                    //helperText={state.helperText}
                    //onChange={handlePasswordChange}
                    //onKeyPress={handleKeyPress}
                    />
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
}*/
