import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React, { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserService from '../../services/UserService';

export function PasswordReset() {
    const [searchParams,] = useSearchParams();

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const emailRef = useRef({ value: '' });

    const navigate = useNavigate();

    const requestReset = () => {
        setLoading(true);
        setError('');
        UserService.requestReset(emailRef.current.value)
            .then(() => navigate('/verification'))
            .catch(err => {
                setError(err?.message ?? err); // show error message if errored
            })
            .finally(() => setLoading(false));
    };

    if (!email || !token)
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="-mt-16">
                    <CardHeader title="Enter Your Email: " className="text-center bg-zinc-800 text-white" />
                    <CardContent>
                        <div className="p-4">
                            <TextField
                                variant="standard"
                                fullWidth
                                id="email"
                                type="email"
                                label="Email"
                                placeholder="Email"
                                margin="normal"
                                inputRef={emailRef} />
                        </div>
                        {
                            error && <div className="mt-4 text-red-500">Error: {error}</div>
                        }
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                            onClick={requestReset}
                            className="w-full">
                            Send
                        </Button>
                    </CardActions>
                </Card>
            </div>
        );

    const passwordRef = useRef({value: ''});
    const [isSuccess, setSuccess] = useState(false);

    const resetPassword = () => {
        setLoading(true);
        setError('');

        UserService.resetPassword(email, token, passwordRef.current.value)
            .then(() => {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 1500);
            })
            .catch(err => {
                setError(err?.message ?? err); // show error message if errored
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Card className="-mt-16">
                <CardHeader title="Enter Your New Password: " className="text-center bg-zinc-800 text-white" />
                <CardContent>
                    <div className="p-4">
                        <TextField
                            variant="standard"
                            fullWidth
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Password"
                            margin="normal"
                            inputRef={passwordRef} />
                    </div>
                    {
                        error && <div className="mt-4 text-red-500">Error: {error}</div>
                    }
                    {
                        isSuccess && <div className="mt-4">Success! Navigating to login...</div>
                    }
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={resetPassword}
                        className="w-full">
                        Send
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}