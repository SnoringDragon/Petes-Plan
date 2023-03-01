import { Layout } from '../../components/layout/layout';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React from 'react';


export function ClassHistory() {
    return (<Layout>
        <div><div className="w-full h-full ml-1 mt-16 flex items-center justify-left">
        <Card className="-mt-16 ">
            <CardHeader title="Search Courses" className="text-center h-10 bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-1 h-16 px-20">
                    <TextField
                        fullWidth
                        id="coursename"
                        type="name"
                        label="Course Name (ex: CS180)"
                        placeholder="Course Name (ex: CS180)"
                        margin="normal"
                    />
                </div>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="w-full h-6">
                    Search
                </Button>
            </CardActions>
        </Card>
    </div></div>
    <br></br>
    <div><div className="overflow-auto w-full h-full ml-1 mt-16 flex items-center justify-left">
    </div></div>
    </Layout>);
}