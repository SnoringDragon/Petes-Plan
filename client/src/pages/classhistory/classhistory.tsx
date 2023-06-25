import { Layout } from '../../components/layout/layout';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ApiCourse } from '../../types/course-requirements';
import CourseService from '../../services/CourseService';
import { UserCourse } from '../../types/user-course';
import CourseHistoryService from '../../services/CourseHistoryService';
import courseHistoryService from '../../services/CourseHistoryService';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select
} from '@material-ui/core';
import { Semester } from '../../types/semester';
import SemesterService from '../../services/SemesterService';
import GPAService from '../../services/GPAService';
import { CourseLink } from '../../components/course-link/course-link';


const gradeRegex = /^(?:[A-D][-+]?|[EFPNSIWU]|(?:PI|PO|IN|WN|IX|WF|SI|IU|WU|AU|CR|NS))$/;

export function ClassHistory() {

    const searchRef = useRef({ value: '' });
    const gradeRef = useRef({ value: '' });

    const [course, setCourse] = useState<ApiCourse | null>(null);
    const [userCourses, setUserCourses] = useState<UserCourse[]>([]);

    const [error, setError] = useState('');

    const [createSem, setSem] = useState(false);
    const yearRef = useRef({value:''});
    const [semCourse, setSemCourse] = useState<ApiCourse>();
    const [selectedSem, setSelectedSem] = useState('Fall');
    const [showWarning, setWarning] = useState(false);

    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedGpaSemester, setSelectedGpaSemester] = useState<string>(''
    );

    const [courseModifications, setCourseModifications] = useState<{
        delete: string[],
        modify: Pick<UserCourse, '_id' | 'grade'>[],
        add: Omit<UserCourse, '_id' | 'courseData'>[]
    }>({ delete: [], modify: [], add: [] });

    const [gpas, setGpas] = useState<{
        cumulative: number | null,
        major: number | null,
        semester: number | null }>({ cumulative: null, major: null, semester: null });

    useEffect(() => {
        CourseHistoryService.getCourses()
            .then(res => setUserCourses(res.courses));

        SemesterService.getSemesters().then(res => setSemesters(res));
    }, []);

    useEffect(() => {
        GPAService.getCumulativeGPA().then(res => setGpas(gpas => ({
            ...gpas,
            cumulative: res
        })))

        GPAService.getMajorGPA().then(res => setGpas(gpas => ({
            ...gpas,
            major: res
        })))
    }, [courseModifications]);

    useEffect(() => {
        const sem = semesters.find(({ _id }) => _id === selectedGpaSemester);
        if (sem)
            GPAService.getSemesterGPA({ semesterInput: sem.semester, yearInput: sem.year })
                .then(res => setGpas(gpas => ({
                    ...gpas,
                    semester: res
                })))
    }, [courseModifications, selectedGpaSemester]);


    const search = () => {
        CourseService.searchCourse(searchRef.current.value)
            .then(res => res.length ? setCourse(res[0]) : setCourse(null))
    };

    const save = () => {
        const promises = [];

        if (courseModifications.delete.length)
            promises.push(CourseHistoryService.deleteCourses(courseModifications.delete));

        if (courseModifications.modify.length)
            promises.push(CourseHistoryService.modifyCourses(courseModifications.modify));

        if (courseModifications.add.length)
            promises.push(CourseHistoryService.addCourses(courseModifications.add));

        Promise.all(promises)
            .then(() => CourseHistoryService.getCourses())
            .then(res => {
                setUserCourses(res.courses);
                setCourseModifications({ delete: [], modify: [], add: [] });
            })
            .catch(err => {
                setError(err?.message ?? err);
            })
    };


    return (
        <Layout>
            <Dialog open={createSem} onClose={() => setSem(false)}>
                <DialogTitle>Select Past Semester</DialogTitle>    
                <DialogContent>
                    <Select
                        variant="standard"
                        fullWidth
                        value={selectedSem}
                        onChange={e => setSelectedSem(e.target.value as string)}>
                           <MenuItem value="Fall">Fall</MenuItem>
                           <MenuItem value="Spring">Spring</MenuItem>
                           <MenuItem value="Summer">Summer</MenuItem>
                    </Select>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Year"
                        fullWidth
                        variant="standard"
                        inputRef={yearRef}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSem(false)}>Cancel</Button>
                    <Button onClick={() => {
                        const modifications = {...courseModifications};
                        modifications.add = [...modifications.add, {
                            subject: semCourse!.subject,
                                courseID: semCourse!.courseID,
                                semester: selectedSem,
                                grade: gradeRef.current.value,
                                year: parseInt(yearRef.current.value)
                        }];
                        setCourseModifications(modifications);
                        setSem(false);
                    }}>Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showWarning} onClose={() => setWarning(false)}>
                <DialogTitle>The prerequisites for this course have not been fulfilled!</DialogTitle>    
                <DialogActions>
                    <Button onClick={() => setSem(false)}>Cancel</Button>
                    <Button onClick={() => {
                       setSemCourse(course!);
                       setSem(true);
                        //TODO Update Integration 
                    }}>Override</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!error} onClose={() => setError('')}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {error}
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setError('')}>Close</Button>
                </DialogActions>
            </Dialog>
            
            <div className="flex">
                <div className="overfill-auto flex flex-grow ml-8 h-full">
                    <div className="w-full h-full ml-1 mt-20  items-center justify-right">
                        <Card className="-mt-16 ">
                            <CardHeader title="Search Courses" className="text-center h-10 bg-zinc-800 text-white" />
                            <CardContent>
                                <div className="p-1 h-16 px-4">
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        id="coursename"
                                        type="name"
                                        label="Course Name"
                                        placeholder="Course Name"
                                        margin="normal"
                                        inputRef={searchRef} />
                                </div>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    onClick={search}
                                    className="w-full h-6">
                                    Search
                                </Button>
                            </CardActions>
                        </Card>

                    {course &&
                            <div className="w-full h-full ml-1 mt-8 items-center justify-right">
                                <Card>
                                    <CardHeader title={`${course.subject} ${course.courseID}`}
                                                className="text-center h-10 bg-zinc-500 text-white"/>
                                    <CardContent>
                                        <div className="p-1 h-8 px-4 ml-4">
                                            <CourseLink courseID={course.courseID} subject={course.subject} useColor={false} />
                                            <br></br>
                                            <p></p>
                                            Credit Hours: {course.minCredits} to {course.maxCredits}
                                        </div>
                                        <div className="p-1 mt-8 h-16 px-10">
                                        <TextField
                                            variant="standard"
                                            id="grade"
                                            type="grade"
                                            label="Grade in Course"
                                            placeholder="Grade in Course"
                                            margin="normal"
                                            inputRef={gradeRef} />
                                        </div>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            color="primary"
                                            className="w-full h-6"
                                            onClick={() => {
                                                if (showWarning) {
                                                    setWarning(true);
                                                } else {
                                                setSemCourse(course);
                                                setSem(true);
                                                }
                                            }}>
                                            Add to History
                                        </Button>
                                    </CardActions>
                                </Card>
                            </div>
                    }
                    </div>
                </div>
                {/*<div className="overfill-auto">*/}
                {/*    <div className="w-full h-full ml-1 mt-10 flex items-center justify-left">*/}
                {/*        <Card className="-mt-16 ">*/}
                {/*            <CardHeader title="Enter Planned Semester Date" className="text-center h-10 bg-zinc-800 text-white" />*/}
                {/*            <CardContent>*/}
                {/*                <div className="p-1 h-16 px-36">*/}
                {/*                    <TextField*/}
                {/*                        fullWidth*/}
                {/*                        id="semestername"*/}
                {/*                        type="name"*/}
                {/*                        label="Semester Name (ex: Spring 2023)"*/}
                {/*                        placeholder="Semester Name (ex: Spring 2023)"*/}
                {/*                        margin="normal"*/}
                {/*                    />*/}
                {/*                </div>*/}
                {/*            </CardContent>*/}
                {/*            <CardActions>*/}
                {/*                <Button*/}
                {/*                    variant="contained"*/}
                {/*                    size="large"*/}
                {/*                    color="secondary"*/}
                {/*                    className="w-full h-6">*/}
                {/*                    Search*/}
                {/*                </Button>*/}
                {/*            </CardActions>*/}
                {/*        </Card>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*TODO*/}
                <div className="overfill-auto flex flex-grow ml-8  h-full">
                    <div className="w-full h-full w-80 mt-20 items-center justify-right">
                        <Card className="-mt-16 w-10/12">
                            <CardHeader title="GPA" className="text-center h-10 bg-zinc-800 text-white" />
                            <CardContent>
                                <span>Semester:</span>
                                <Select
                                    variant="standard"
                                    value={selectedGpaSemester}
                                    onChange={ev => setSelectedGpaSemester(ev.target.value as string)}>
                                    {semesters.map(sem => <MenuItem key={sem._id} value={sem._id}>
                                        {sem.semester} {sem.year}
                                    </MenuItem>)}
                                </Select>
                                <br />

                               <span>Cumulative GPA: {gpas.cumulative === null ? 'N/A' : gpas.cumulative.toFixed(2)}</span>
                               <br></br>
                               <span>Semester GPA: {gpas.semester === null ? 'N/A' : gpas.semester.toFixed(2)}</span>
                                <br/>
                                <span>Major GPA: {gpas.major === null ? 'N/A' : gpas.major.toFixed(2)}</span>

                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="overfill-auto flex flex-grow  h-full">
                    <div className="w-full h-full ml-1 mt-20  items-center justify-right">
                        <Card className="-mt-16 w-10/12 w-90">
                            <CardHeader title="Completed Courses" className="text-center h-10 bg-zinc-800 text-white" />
                            <CardContent>
                                {userCourses.map((course, i) => (<div className="flex items-center mb-2" key={i}>
                                    <CourseLink courseID={course.courseID} subject={course.subject} className="mr-2 w-40" useColor={false} />
                                    <div className="ml-2  mr-8"><TextField
                                        variant="standard"
                                        value={course.grade}
                                        onChange={ev => {
                                            const newCourses = [...userCourses];
                                            newCourses[i].grade = ev.target.value;
                                            setUserCourses(newCourses);
                                            const newModifications = courseModifications.modify.filter(x => x._id !== course._id);
                                            setCourseModifications({...courseModifications, modify: [...newModifications, {
                                                    _id: course._id,
                                                    grade: ev.target.value
                                                }] });
                                        }} /></div>
                                    <div className="mx-2" />
                                    <Button variant="contained" color="secondary" onClick={() => {
                                        setUserCourses(userCourses.filter(x => x !== course));
                                        setCourseModifications({...courseModifications,
                                            delete: [...courseModifications.delete, course._id]})
                                    }}>Delete</Button>
                                </div>))}
                                {courseModifications.add.map((course, i) => (<div className="flex items-center mb-2" key={i}>
                                    <div className="mr-4">{course.subject} {course.courseID}:</div>
                                    <TextField
                                        variant="standard"
                                        value={course.grade}
                                        onChange={ev => {
                                            const newAdditions = courseModifications.add.map(x => {
                                                if (x === course)
                                                    return { ...x, grade: ev.target.value }
                                                return x;
                                            });
                                            setCourseModifications({...courseModifications, add: newAdditions });
                                        }} />
                                    <div className="mx-2" />
                                    <Button variant="contained" color="secondary" onClick={() => {
                                        setCourseModifications({...courseModifications,
                                            add: courseModifications.add.filter(x => x !== course)})
                                    }}>Delete</Button>
                                </div>))}
                            </CardContent>
                            <CardActions>
                                {(courseModifications.add.length || courseModifications.delete.length
                                    || courseModifications.modify.length) ? <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    className="w-full h-6" onClick={save}>
                                    Save
                                </Button> : null}
                            </CardActions>
                        </Card>
                    </div>
                </div>
            </div>
            
        </Layout>
    );
}
