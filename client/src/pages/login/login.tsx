import { 
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    TextField
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import UserService from '../../services/UserService';

export function Login() {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<any>('');
    const [rememberMe, setRememberMe] = useState(false);
    const usernameRef = useRef({value: null});
    const passwordRef = useRef({value: null});

    const navigate = useNavigate();

    useEffect(() => {
        if (UserService.isLoggedIn())
            return navigate('/');
        UserService.clearTokens();
    }, []);

    const login = () => {
        setLoading(true); // set ui loading
        setError(''); // clear previous error
        UserService.login(usernameRef.current?.value ?? '',
            passwordRef.current?.value ?? '', rememberMe)
            .then(() => {
                navigate('/'); // success, navigate to home
            })
            .catch(err => {
                setError(err.message ?? err); // show error to user
            })
            .finally(() => {
                setLoading(false); // set ui not loading
            });
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Card className="-mt-16">
                <CardHeader title="Login" className="text-center bg-zinc-800 text-white" />
                <CardContent>
                    <div className="p-4">
                        <TextField
                            variant="standard"
                            fullWidth
                            id="username"
                            type="email"
                            label="Username"
                            placeholder="Username"
                            margin="normal"
                            inputRef={usernameRef} />
                        <TextField
                            variant="standard"
                            fullWidth
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Password"
                            margin="normal"
                            inputRef={passwordRef} />
                        <Checkbox
                        onChange={() => setRememberMe(!rememberMe)}
                        checked={rememberMe}
                        />
                        <text>Remember me</text>
                        <p></p>
                        <div className="flex">
                            <Link to="/password-reset" className="mr-auto">Forgot your password?</Link>
                            <Link to="/register">Need an account?</Link>
                        </div>
                        {
                            error && <div className="mt-4 text-red-500">Error: {error}</div>
                        }
                    </div>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        className="w-full"
                        onClick={login}
                        disabled={isLoading}>
                        Login
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}
