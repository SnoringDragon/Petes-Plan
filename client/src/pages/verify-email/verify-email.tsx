import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import React, { useRef, useState } from 'react';
import UserService from '../../services/UserService';

export function VerifyEmail() {
    const passwordRef = useRef({ value: '' });
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [isSuccess, setSuccess] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    const verify = () => {
        setError('');
        setLoading(true);
        console.log(searchParams.get('email'), searchParams.get('token'))
        UserService.verifyEmail(searchParams.get('email') ?? '', searchParams.get('token') ?? '',
            passwordRef.current.value)
            .then(() => {
                setSuccess(true); // show success if successful
                setTimeout(() => navigate('/login'), 1500)
            })
            .catch(err => {
                setError(err?.message ?? err); // show error message if errored
            })
            .finally(() => {
                setLoading(false); // clear loading status
            });
    };

    return (<div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title="Verify Email" className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <TextField
                        fullWidth
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Password"
                        margin="normal"
                        inputRef={passwordRef}
                    />

                    <div className="flex">
                        <Link to="/password-reset" className="mr-auto">Forgot your password?</Link>
                    </div>

                    {error && <div className="mt-4 text-red-500">Error: {error}</div>}

                    {isSuccess && <div className="mt-4">
                        Success! Redirecting to login.
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
                    onClick={verify}>
                    Verify
                </Button>
            </CardActions>
        </Card>
    </div>)
}