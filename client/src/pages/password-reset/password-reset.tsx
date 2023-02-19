import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React from 'react';

export function PasswordReset() {
    return (<div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title="Enter Your Email: " className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <TextField
                        fullWidth
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="Email"
                        margin="normal"
                    />
                </div>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="w-full">
                    Send
                </Button>
            </CardActions>
        </Card>
    </div>)
}