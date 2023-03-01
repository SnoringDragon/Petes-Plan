import { Layout } from '../../components/layout/layout';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React from 'react';

// function showClasses(num: number) {
//     for (let i = 0; i < num; i++) {
//         getClass()
//     }
// }

// function getClass() {
//     return (
//         <div><div><div className="w-full h-full ml-1 mt-16 flex items-center justify-left">
//         <Card className="-mt-16 ">
//             <CardHeader title="Example Course Title" className="text-center h-10 bg-zinc-800 text-white" />
//             <CardContent>
//                 <div className="p-1 h-16 px-20">
//                     <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//                         Credit Hours: 4.00
//                     </Typography>
//                     <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//                     Problem solving and algorithms, implementation of algorithms in a high level programming language, conditionals, the iterative approach and debugging, collections of data, searching and sorting, solving problems by decomposition, the object-oriented approach, subclasses of existing classes, handling exceptions that occur when the program is running, graphical user interfaces (GUIs), data stored in files, abstract data types, a glimpse at topics from other CS courses.  Intended primarily for students majoring in computer sciences. Credit cannot be obtained for both CS 18000 and any of 15600, 15800 and 15900. Not open to students with credit in CS 24000.
//                     </Typography>
//                 </div>
//             </CardContent>
//             <CardActions>
//                 <Button
//                     variant="contained"
//                     size="large"
//                     color="secondary"
//                     className="w-full h-6">
//                     Add to History
//                 </Button>
//             </CardActions>
//         </Card>
//     </div></div></div>)
// }

export function ClassHistory() {
    return (<Layout>
        <div>
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
    
    </div>
    <br></br>
    <div className="overfill-auto">
    <div><div className="w-full h-full ml-1 mt-16 flex items-center justify-center">
    <Card className="-mt-16 w-100">
            <CardHeader title="CS18000" className="text-center h-10 bg-zinc-500 text-white" />
            <CardContent>
                <div className="p-1 h-10 px-10">
                        {"Object Oriented Programming"}
                        <br></br>
                        <p></p>
                        <a href='https://selfservice.mypurdue.purdue.edu/prod/bzwsrch.p_catalog_detail?term=202320&subject=CS&cnbr=18000&enhanced=Y'><u>Credit Hours: 4.00</u></a >
                </div>
                <TextField
                        id="grade"
                        type="grade"
                        label="Grade in Course"
                        placeholder="Grade in Course"
                        margin="normal"
                        className="justify-center"
                    />
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    className="w-full h-6">
                    Add to History
                </Button>
            </CardActions>
            </Card>
    </div></div>
    <div><div className="w-full h-full ml-1 mt-16 py-5 flex items-center justify-center">
    <Card className="-mt-16 w-100">
            <CardHeader title="CS18000" className="text-center h-10 bg-zinc-500 text-white" />
            <CardContent>
                <div className="p-1 h-10 px-10">
                        {"Object Oriented Programming"}<p></p>
                        <a href='https://selfservice.mypurdue.purdue.edu/prod/bzwsrch.p_catalog_detail?term=202320&subject=CS&cnbr=18000&enhanced=Y'><u>Credit Hours: 4.00</u></a >
                </div>
                <TextField
                        id="grade"
                        type="grade"
                        label="Grade in Course"
                        placeholder="Grade in Course"
                        margin="normal"
                        className="justify-center"
                    />
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    className="w-full h-6">
                    Add to History
                </Button>
            </CardActions>
            </Card>
    </div></div>
    </div>
    </Layout>);
}