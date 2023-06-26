import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';

import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import React, { useEffect, useRef, useState } from 'react';
import UserService from '../../services/UserService';
import { Layout } from '../../components/layout/layout';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


export function Modify_Profile_Page() {
    const [userData, setUserData] = useState<{ email?: string, name?: string } | null>(null);
    const nameRef = useRef({ value: '' });
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

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

    const [open, setOpen] = useState(false);
    const [dialog, setDialog] = useState({
        title: 'Are you Sure?',
        text: 'This will permanently delete your account.',
        buttons: true
    });

    const deleteAccount = () => {
        setLoading(true);
        setError('');
        setOpen(false);

        UserService.deleteAccount()
            .then(() => {
                setOpen(true);
                setDialog({
                    title: 'Account Deleted',
                    text: 'Your account has been deleted.',
                    buttons: false
                });
                UserService.clearTokens();
                setTimeout(() => navigate('/'), 1500);
            })
            .catch(err => {
                setError(err?.message ?? err); // show error message if errored
            })
            .finally(() => {
                setLoading(false);
            })
    };

    return (
        <Layout>
            <Dialog open={open}
                onClose={() => setOpen(false)}>
                <DialogTitle>{dialog.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialog.text}
                    </DialogContentText>
                </DialogContent>
                { dialog.buttons && <DialogActions>
                    <Button color="secondary" onClick={() => setOpen(false)} autoFocus>Cancel</Button>
                    <Button onClick={deleteAccount}>
                        OK
                    </Button>
                </DialogActions>}
            </Dialog>
            
            <div className="w-full h-full flex items-center justify-center">
            <Card className="-mt-16">
                <CardHeader title="Modify Profile" className="text-center bg-zinc-800 text-white" />
                <CardContent>
                    <div className="p-4">
                        <TextField
                            variant="standard"
                            fullWidth
                            id="name"
                            type="name"
                            label={userData?.name}
                            placeholder="name"
                            margin="normal"
                            inputRef={nameRef} />
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
                        disabled={isLoading}
                        onClick={() => setOpen(true)}>
                        Delete Account
                    </Button>
                </CardActions>
            </Card>
        </div></Layout>
    );
}