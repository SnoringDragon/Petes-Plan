import { Layout } from '../../components/layout/layout';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

var text: String = "";

function getText(text: Array<String>, coursename: String, cre: String, link: String) {
    // co = 
    // {
    //     name: coursename,
    //     credit: cre,
    //     link: link 
    // }

    text.push()
    //var ne: String = prev.concat(text.toString());
    //text = ne;
}

export function FuturePlan() {
    const navigate = useNavigate()
    const [visibility, setVisibility] = useState(false);
    const [vis, setVis] = useState(false);
    const [courses, setCourses] = useState([]);
    
    var cl: String = "Object Oriented Programming"

    // var classes =
    // [
    //     {
    //         name: "CS18000:",
    //         credit: "4.00",
    //         link: "https://selfservice.mypurdue.purdue.edu/prod/bzwsrch.p_catalog_detail?term=202320&subject=CS&cnbr=18000&enhanced=Y"
    //     }
    // ]

    return (<Layout>

        <div className="grid grid-cols-2 gap-y-2">
            <div className="w-full h-full ml-1 mt-10 flex items-center justify-left">
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
                            onClick={() => setVisibility(!visibility)}
                            className="w-full h-6">
                            Search
                        </Button>
                    </CardActions>
                </Card>
            </div>
            <div className="overfill-auto">
                <div className="w-full h-full ml-1 mt-10 flex items-center justify-left">
                    <Card className="-mt-16 ">
                        <CardHeader title="Enter Planned Semester Date" className="text-center h-10 bg-zinc-800 text-white" />
                        <CardContent>
                            <div className="p-1 h-16 px-36">
                                <TextField
                                    fullWidth
                                    id="semestername"
                                    type="name"
                                    label="Semester Name (ex: Spring 2023)"
                                    placeholder="Semester Name (ex: Spring 2023)"
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
                </div>
            </div>
            <div className={`overfill-auto col-start-1 ${visibility ? 'visible' : 'invisible'}`}>
                <div className="w-full h-full ml-1 mt-16 flex items-center justify-left">
                    <Card className={'-mt-16 w-100'}>
                        <CardHeader title="CS18000" className="text-center h-10 bg-zinc-500 text-white" />
                        <CardContent>
                            <div className="p-1 h-10 px-10">
                                {"Object Oriented Programming"}
                                <br></br>
                                <p></p>
                                <a href='/course_descriptions'><u>Credit Hours: 4.00</u></a >
                            </div>
                            <TextField
                                id="grade"
                                type="grade"
                                label="Grade in Course"
                                placeholder="Grade in Course"
                                margin="normal"
                            />
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                onClick={() => setVis(!vis)}
                                className="w-full h-6">
                                Add to History
                            </Button>
                        </CardActions>
                    </Card>
                </div>
            </div>
            <div className="overfill-auto col-start-2 flex row-start-2 justify-right">
                <div className="w-full h-full ml-1 mt-24  items-center justify-right">
                    <Card className="-mt-16 w-10/12">
                        <CardHeader title="Enrolled Courses" className="text-center h-10 bg-zinc-800 text-white" />
                        <CardContent>
                            <div className={`p-1 h-16 text-center ${vis ? 'visible' : 'invisible'}`}>
                                {cl}
                                <br></br>
                                {"Credit: 4.00\n"}
                            </div>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                size="large"
                                color="secondary"
                                className="w-full h-6">
                                Save
                            </Button>
                        </CardActions>
                    </Card>
                </div>
            </div>
        </div>
        
    </Layout>);
}