import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React, { useEffect, useRef, useState } from 'react';
import UserService from '../../services/UserService';
import { Link, useNavigate } from 'react-router-dom';

export function Register() {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [isSuccess, setSuccess] = useState(false);
    const nameRef = useRef({ value: '' });
    const emailRef = useRef({ value: '' });
    const passwordRef = useRef({ value: '' });
    const confirmPasswordRef = useRef({ value: '' });

    const register = () => {
        if (passwordRef.current.value !== confirmPasswordRef.current.value)
            return setError('passwords do not match');
        setError(''); // clear error
        setLoading(true); // set loading status
        UserService.register(emailRef.current?.value, passwordRef.current?.value, nameRef.current.value)
            .then(() => {
                setSuccess(true); // show success if successful
            })
            .catch(err => {
                setError(err?.message ?? err); // show error message if errored
            })
            .finally(() => {
                setLoading(false); // clear loading status
            })
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (UserService.isLoggedIn())
            return navigate('/');
        UserService.clearTokens();
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Card className="-mt-16">
                <CardHeader title="Register" className="text-center bg-zinc-800 text-white" />
                <CardContent>
                    <div className="p-4">
                        <TextField
                            variant="standard"
                            fullWidth
                            id="name"
                            type="name"
                            label="Name"
                            placeholder="Name"
                            margin="normal"
                            inputRef={nameRef} />
                        <TextField
                            variant="standard"
                            fullWidth
                            id="email"
                            type="email"
                            label="Email"
                            placeholder="Email"
                            margin="normal"
                            inputRef={emailRef} />
                        <TextField
                            variant="standard"
                            fullWidth
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Password"
                            margin="normal"
                            inputRef={passwordRef} />
                        <TextField
                            variant="standard"
                            fullWidth
                            id="confirm password"
                            type="password"
                            label="Confirm Password"
                            placeholder="Confirm Password"
                            margin="normal"
                            inputRef={confirmPasswordRef} />

                        <div className="flex">
                            <Link to="/password-reset" className="mr-auto">Forgot your password?</Link>
                            <Link to="/login">Already have an account?</Link>
                        </div>

                        {error && <div className="mt-4 text-red-500">Error: {error}</div>}
                        {isSuccess && <div className="mt-4">
                            Success! Check your email to verify.
                        </div>}
                    </div>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        className="w-full"
                        disabled={isLoading}
                        onClick={register}>
                        Register
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}