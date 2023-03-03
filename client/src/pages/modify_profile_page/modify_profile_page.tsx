import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React, { useEffect, useRef, useState } from 'react';
import UserService from '../../services/UserService';
import { Layout } from '../../components/layout/layout';
import { Link } from 'react-router-dom';


export function Modify_Profile_Page() {
    const [userData, setUserData] = useState<{ email?: string, name?: string } | null>(null);
    const nameRef = useRef({ value: '' });
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        UserService.getUserData().then(data => setUserData(data));
    }, []);

    const update = () => {
        setLoading(true);
        setError('');
        const name = nameRef.current.value;

        UserService.setUserData({ name  })
            .then(() => {
                setUserData({ ...userData, name });
            })
            .catch(err => {
                setError(err?.message ?? err); // show error message if errored
            })
            .finally(() => {
                setLoading(false); // clear loading status
            });
    };

    return (<Layout><div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title="Modify Profile" className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <TextField
                        fullWidth
                        id="name"
                        type="name"
                        label={userData?.name}
                        placeholder="name"
                        margin="normal"
                        inputRef={nameRef}
                    />
                    <p></p>
                    <text><u><br />Email: </u> {userData?.email}</text>
                    <p></p>
                    <Link to='/password-reset'><u><br />To change your password, click here.</u></Link >

                    {error && <div className="mt-4 text-red-500">Error: {error}</div>}
                </div>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="w-half"
                    disabled={isLoading}
                    onClick={update}>
                    Apply Changes
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="w-half"
                    disabled={isLoading}>
                    Delete Account
                </Button>
            </CardActions>
        </Card>
    </div></Layout>)
}