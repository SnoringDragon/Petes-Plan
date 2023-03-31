import { Layout } from '../../components/layout/layout';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { ApiCourse } from '../../types/course-requirements';
import CourseService from '../../services/CourseService';
import { Degree } from '../../types/degree';
import DegreeService from '../../services/DegreeService';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select
} from '@material-ui/core';
import { DegreePlan } from '../../types/degree-plan';
import DegreePlanService from '../../services/DegreePlanService';
import { UserCourse } from '../../types/user-course';
import { Section } from '../../types/course-requirements';
import { ApiProfessor } from '../../types/professor';
import { Semester } from '../../types/semester';
import SemesterService from '../../services/SemesterService';
import GPAService from '../../services/GPAService';

const renderSectionMenuItem = (section: Section, instructorFilter: string = '') => {
    if (instructorFilter && !section.meetings.some(m => m.instructors.some(i => i._id === instructorFilter)))
        return null;

    return <MenuItem value={section._id} key={section._id}>
        {section.meetings.map(meeting => <span>
                            {meeting.days} {meeting.startTime ? `${meeting.startTime}-${meeting.endTime}` : 'Time TBA'} <br />{meeting.instructors.length ? meeting.instructors.map(instructor => <span>
                            {instructor.firstname} {instructor.lastname}
                        </span>) : 'Instructor To Be Assigned'}
                        </span>)}
    </MenuItem>;
}

export function FuturePlan() {
    const navigate = useNavigate()

    const [courses, setCourses] = useState<ApiCourse[]>([]);
    const [degrees, setDegrees] = useState<Degree[]>([]);
    const [degreePlans, setDegreePlans] = useState<DegreePlan[]>([]);
    const [degreePlan, setDegreePlan] = useState<DegreePlan | null>(null);
    const [error, setError] = useState('');
    const [section, setSection] = useState<Section[][][]>([]);

    const [createNewPlan, setCreateNewPlan] = useState(false);


    const nameRef = useRef({ value: '' });
    const searchRef = useRef({ value: '' });
    const [createSem, setSem] = useState(false);
    const yearRef = useRef({ value: '' });
    const [semCourse, setSemCourse] = useState<ApiCourse>();
    const [selectedSem, setSelectedSem] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [modifyCourse, setModifyCourse] = useState<UserCourse | null>(null);
    const [instructorFilter, setInstructorFilter] = useState<string>('');

    const [semesterFilter, setSemesterFilter] = useState<string>('');
    const [semesters, setSemesters] = useState<Semester[]>([]);

    const [cumulativeGpa, setCumulativeGpa] = useState<number | null>(null)
    const [semesterGpa, setSemesterGpa] = useState<number | null>(null)
    const [selectedGpaSemester, setSelectedGpaSemester] = useState('');

    const [degreeSearch, setDegreeSearch] = useState('');

    const [courseModifications, setCourseModifications] = useState<{
        add: UserCourse[],
        delete: string[]
    }>({ delete: [], add: [] });

    const [degreeModifications, setDegreeModifications] = useState<{
        add: Degree[],
        delete: string[]
    }>({ delete: [], add: [] });


    const search = () => {
        CourseService.searchCourse(searchRef.current.value)
            .then(res => setCourses(res));
    };

    const save = async () => {
        try {
            await DegreePlanService.removeFromDegreePlan(degreePlan!._id, degreeModifications.delete, courseModifications.delete)
            await DegreePlanService.addToDegreePlan(degreePlan!._id, degreeModifications.add,
                courseModifications.add.map(a => {
                    const { _id, courseData, section, ...rest } = a;
                    return { ...rest, section: section?._id! };
                }));

            setCourseModifications({ add: [], delete: [] });
            setDegreeModifications({ add: [], delete: [] });
        } catch (e) {
            alert('Failed to update: ' + ((e as any)?.message ?? e)); // it is 4 am and i do not want to style this more
        }

        DegreeService.getDegrees().then(res => setDegrees(res));
        DegreePlanService.getPlans().then(res => {
            setDegreePlans(res.degreePlans);
            setDegreePlan(res.degreePlans.find(p => p._id === degreePlan?._id)!);
        });
    }

    useEffect(() => {
        DegreeService.getDegrees().then(res => setDegrees(res));
        DegreePlanService.getPlans().then(res => {
            setDegreePlans(res.degreePlans);
            if (res.degreePlans.length)
                setDegreePlan(res.degreePlans[0]);
        });
        SemesterService.getSemesters().then(res => setSemesters(res));
        GPAService.getCumulativeGPA().then(res => setCumulativeGpa(res));
    }, []);

    useEffect(() => {
        const sem = semesters.find(({ _id }) => _id === selectedGpaSemester);
        if (sem)
        GPAService.getSemesterGPA({ semesterInput: sem?.semester , yearInput: sem?.year })
            .then(res => setSemesterGpa(res))
        else setSemesterGpa(null);
    }, [selectedGpaSemester]);

    useEffect(() => {
        const subject = semCourse?.subject ?? '';
        const courseID = semCourse?.courseID ?? '';

        if (selectedSem != null) {
            CourseService.getCourseSections({ subject, courseID, semester: selectedSem })
                .then(res => {
                    if (!res) {
                        setSection([]);
                        setError('Course Sections not found');
                        return;
                    }
                    setSection(res);
                })
                .catch(err => {
                    setError(err?.message ?? err);
                });
        }
    }, [selectedSem, semCourse])

    return (<Layout>
        <Dialog open={createNewPlan} onClose={() => setCreateNewPlan(false)}>
            <DialogTitle>Enter Plan Name</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    fullWidth
                    variant="standard"
                    inputRef={nameRef}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setCreateNewPlan(false)}>Cancel</Button>
                <Button onClick={() => {
                    DegreePlanService.createDegreePlan(nameRef.current.value)
                        .then((newPlan) => {
                            DegreePlanService.getPlans()
                                .then(res => {
                                    setDegreePlans(res.degreePlans);
                                    setDegreePlan(res.degreePlans.find(p => p._id === newPlan.degreePlan._id)!)
                                });
                            setCreateNewPlan(false);
                        })
                        .catch(err => setError(err?.message ?? err))

                }}>Create</Button>
            </DialogActions>
        </Dialog>

        <Dialog open={createSem} onClose={() => setSem(false)}>
            <DialogTitle>Select Planned Semester</DialogTitle>
            <DialogContent>
                <div className="mb-2">Select Semester</div>

                <Select fullWidth className="text-red-500" labelId="demo-simple-select-label"
                    value={selectedSem}
                    label="Semester"
                    onChange={ev => {
                        setSection([])
                        setSelectedSem(ev.target.value as string)
                        setSelectedSection(null);
                    }} >
                    {semCourse?.semesters?.filter(semester => semester.year >= new Date().getFullYear())
                        .map((semester) => (<MenuItem key={semester._id} value={semester._id}>
                        {semester.semester} {semester.year}
                    </MenuItem>))}
                </Select>

                {section.flat().length ? <>
                    <div className="mt-4 mb-2">Filter Instructors</div>

                    <Select fullWidth value={instructorFilter}
                                                 onChange={ev => setInstructorFilter(ev.target.value as string)}>
                        <MenuItem value={""}>No Filter</MenuItem>
                        {[...section.flat(2).flatMap(s => s.meetings
                                .flatMap(m => m.instructors))
                            .reduce((dict, instructor) => {
                                dict.set(instructor._id, instructor);
                                return dict;
                            }, new Map<string, ApiProfessor>())]
                            .map(([, instructor]) => <MenuItem key={instructor._id} value={instructor._id}>
                                {instructor.firstname} {instructor.lastname}
                            </MenuItem>)}
                </Select></> : null}

                <div className="mt-4 mb-2">Select Section</div>

                {section.flat().length ? <Select fullWidth className="my-2" value={selectedSection?._id} onChange={ev =>
                    setSelectedSection(section.flat(2).find(({ _id }) => _id === ev.target.value)!)}>
                    {section.flat(2).map(section => renderSectionMenuItem(section, instructorFilter))}
                </Select> : 'No sections available'}
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setSem(false)}>Cancel</Button>
                <Button disabled={!selectedSection} onClick={() => {
                    setSem(false);

                    const semesters = semCourse?.semesters.find(other => other._id === selectedSem)!;
                    setCourseModifications({
                        ...courseModifications,
                        add: [...courseModifications.add, {
                            _id: '' + Date.now(),
                            subject: semCourse!.subject,
                            courseID: semCourse!.courseID,
                            semester: semesters?.semester,
                            grade: 'A',
                            year: semesters?.year,
                            section: selectedSection!,
                            courseData: { ...semCourse!, sections: section }
                        }]
                    });
                }}>Add</Button>
            </DialogActions>
        </Dialog>

        <div className="grid grid-cols-3 gap-y-2 gap-x-3">
            <div className="w-full h-full flex flex-col items-center justify-left">
                <div className="bg-white rounded px-4 pb-3 mb-4 pt-4 text-black w-full">
                    <div className="text-2xl mb-3">Graduation Requirements</div>

                    {(degreePlans?.flatMap(plan => plan.degrees)?.length ?? 0) === 0 ? <div className="pb-2">
                        You don't have any degrees in your degree plans. Please add degrees.
                    </div> : <Button variant="contained" color="secondary" onClick={() => {
                        navigate('/graduation-requirements')
                    }}>View Graduation Requirements</Button>}

                    <div className="text-2xl my-2">GPA</div>


                    <span className="mr-2">Semester:</span>
                    <Select value={selectedGpaSemester} onChange={ev => setSelectedGpaSemester(ev.target.value as string)}>
                        {semesters.map(sem => <MenuItem key={sem._id} value={sem._id}>
                            {sem.semester} {sem.year}
                        </MenuItem>)}
                    </Select>

                    <div className="flex">
                        <span className="mr-4">
                            Cumulative GPA: {cumulativeGpa === null ? 'N/A' : cumulativeGpa.toFixed(2)}
                        </span>
                        <span>
                            Semester GPA: {semesterGpa === null ? 'N/A' : semesterGpa.toFixed(2)}
                        </span>
                    </div>

                </div>
                <div className="bg-white rounded px-4 pb-3 pt-4 text-black w-full">
                    <div className="text-2xl">Search Courses</div>
                    <div className="flex items-center">
                        <TextField
                            fullWidth
                            label="Search"
                            placeholder="Search"
                            margin="normal"
                            onKeyDown={ev => ev.key === 'Enter' && search()}
                            inputRef={searchRef}
                        />
                        <FaSearch className="ml-4 cursor-pointer" onClick={search} />
                    </div>
                </div>
                <div className="border-x border-gray-500 bg-slate-500 rounded mt-4 w-full flex flex-col">
                    {courses.map((course, i) => (<div
                        className="w-full py-3 px-4 bg-gray-600 border-y border-gray-500 flex items-center" key={i}>
                        <Link to={`/course_description?subject=${course.subject}&courseID=${course.courseID}`} className="mr-auto">{course.subject} {course.courseID}: {course.name}</Link>
                        <Button color="inherit" onClick={() => {
                            setSemCourse(course);
                            setSem(true);
                            setInstructorFilter('');
                            setSection([]);
                            // setCourseModifications({
                            //     ...courseModifications,
                            //     add: [...courseModifications.add, {
                            //         subject: course.subject,
                            //         courseID: course.courseID,
                            //         semester: 'Spring',
                            //         grade: 'A',
                            //         year: 2022
                            //     }]
                            // });
                        }}>Add</Button>
                    </div>))}
                </div>
            </div>
            <div className="bg-white rounded px-4 pb-3 pt-4 text-black w-full">
                <div className="text-2xl">Degrees</div>
                <TextField
                    fullWidth
                    label="Search"
                    placeholder="Search"
                    margin="normal"
                    value={degreeSearch}
                    onChange={ev => setDegreeSearch(ev.target.value)}
                />
                {degrees.filter(d => d.name.toLowerCase().includes(degreeSearch.toLowerCase()))
                    .map((degree, i) => (<div key={i} className="my-2 flex">
                        <Link to={`/major_requirements?id=${degree._id}`} className="mr-auto">{degree.type[0].toUpperCase()}{degree.type.slice(1)} in {degree.name}</Link>
                        <Button variant="contained" color="secondary" onClick={() => {
                            setDegreeModifications({
                                ...degreeModifications,
                                add: [...degreeModifications.add, degree]
                            });
                        }}>Add</Button>
                    </div>))}
            </div>
            <div className="col-start-3 flex flex-col justify-right">
                <div className="bg-white rounded px-4 pb-3 pt-4 text-black w-full">
                    <div className="text-2xl">Select Degree Plan</div>
                    <Select fullWidth className="my-2" value={degreePlans.findIndex(p => p.name === degreePlan?.name)} onChange={ev => setDegreePlan(degreePlans[ev.target.value as number])}>
                        {degreePlans.map((plan, i) => (<MenuItem key={i} value={i}>
                            {plan.name}
                        </MenuItem>))}
                    </Select>
                    <Button variant="contained" color="secondary" fullWidth onClick={() => {
                        setError(''); setCreateNewPlan(true)
                    }}>Create New Plan</Button>
                </div>
                {degreePlan && <>
                    <div className="bg-white rounded px-4 pb-3 pt-4 text-black w-full mt-3">
                        <div className="flex">
                            <div className="text-2xl mr-auto">Planned Courses</div>
                            <div><span>Semester filter:&nbsp;</span>
                                <Select value={semesterFilter} onChange={ev => setSemesterFilter(ev.target.value as string)}>
                                    <MenuItem value={""}>None</MenuItem>
                                    {[...new Set([degreePlan.courses, courseModifications.add]
                                        .flat().map(c => `${c.semester} ${c.year}`))].map((sem, i) => <MenuItem key={sem} value={sem}>
                                        {sem}
                                    </MenuItem>)}
                                </Select>
                            </div>
                        </div>
                        {Object.entries([degreePlan.courses, courseModifications.add]
                            .flatMap(courses => {
                                return courses.map(course => ({ course, isNew: courses !== degreePlan.courses }))
                            })
                            .reduce((semesterDict, course) => {
                                const sem = `${course.course.semester} ${course.course.year}`;
                                if (!(sem in semesterDict))
                                    semesterDict[sem] = [];
                                semesterDict[sem].push(course);
                                return semesterDict;
                            }, {} as { [key: string]: {isNew: boolean, course: UserCourse}[] }))
                            .sort(([semA], [semB]) => {
                                const [semATerm, semAYear] = semA.split(' ');
                                const [semBTerm, semBYear] = semB.split(' ');
                                const yearCompare = semAYear.localeCompare(semBYear);
                                if (yearCompare) return -yearCompare;
                                const termOrder = ['Spring', 'Summer', 'Fall', 'Winter'];
                                return termOrder.indexOf(semBTerm) - termOrder.indexOf(semATerm);
                            })
                            .filter(([sem]) => {
                                if (!semesterFilter) return true;
                                return sem === semesterFilter;
                            })
                            .map(([semester, courses], i) =>
                                (<Accordion className="mt-2" defaultExpanded={true}>
                                    <AccordionSummary className="text-lg py-1 h-8"><div >
                                        {semester}
                                    </div ></AccordionSummary>
                                    <AccordionDetails className="flex flex-col">
                                    {courses.map(({ course, isNew }, j) => (<div key={j} className="flex items-center py-2 border-b border-gray-300">
                            <div className="flex flex-col">
                                <Link to={`/course_description?subject=${course.subject}&courseID=${course.courseID}`}>
                                    {course.subject} {course.courseID}
                                </Link>

                                <div>{course.section?.name} ({course.section?.sectionID})</div>
                                <div>Instructors: {(() => {
                                    const instructors = course.section?.meetings.flat().flatMap(m => m.instructors) ?? [];

                                    if (!instructors.length) return 'To Be Assigned';

                                    return instructors.map(instructor => <Link to={`/professor?id=${instructor._id}&filter=${course.courseData._id}`} key={instructor._id}>
                                        {instructor.firstname + ' ' + instructor.lastname}
                                    </Link>);
                                })()}</div>
                            </div>

                            <Dialog open={modifyCourse?._id === course._id}>
                                <DialogTitle>Modify</DialogTitle>
                                <DialogContent>
                                    <div>Section:</div>
                                    <Select defaultValue={course.section?._id} onChange={ev => {
                                        const section = course.courseData.sections?.flat(2).find(s => s._id === ev.target.value)

                                        if (!isNew) {
                                            setDegreePlan({
                                                ...degreePlan,
                                                courses: degreePlan.courses.filter(x => x !== course)
                                            });

                                            setCourseModifications({
                                                delete: [...courseModifications.delete, course._id],
                                                add: [...courseModifications.add, {
                                                    ...course,
                                                    section
                                                }]
                                            });
                                        } else {
                                            setCourseModifications({
                                                ...courseModifications,
                                                add: courseModifications.add.map(c => {
                                                    if (c._id !== course._id) return c;
                                                    return { ...c, section };
                                                })
                                            });
                                        }
                                    }}>
                                        {course.courseData.sections?.flat(2).map(section => renderSectionMenuItem(section))}
                                    </Select>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setModifyCourse(null)}>Close</Button>
                                </DialogActions>
                            </Dialog>

                            <Button className="ml-auto mr-2" variant="contained" color="secondary" onClick={() => {
                                setModifyCourse(course);
                            }}>Modify</Button>
                            <Button variant="contained" color="secondary" onClick={() => {
                                if (!isNew) {
                                    setDegreePlan({
                                        ...degreePlan,
                                        courses: degreePlan.courses.filter(x => x !== course)
                                    });

                                    setCourseModifications({
                                        ...courseModifications,
                                        delete: [...courseModifications.delete, course._id]
                                    });
                                } else {
                                    setCourseModifications({
                                        ...courseModifications,
                                        add: courseModifications.add.filter(({ _id }) => _id !== course._id)
                                    })
                                }
                            }}>Delete</Button>
                                </div>))}</AccordionDetails></Accordion>))}
                        {/*{courseModifications.add.map((course, i) => (<div key={i} className="flex items-center py-2 border-b border-gray-300">*/}
                        {/*    <Link className="mr-auto" to={`/course_description?subject=${course.subject}&courseID=${course.courseID}`}>{course.subject} {course.courseID}</Link>*/}
                        {/*    <div><br />Section Name &emsp;</div>*/}
                        {/*    <Button variant="contained" color="secondary" onClick={() => {*/}
                        {/*        setCourseModifications({*/}
                        {/*            ...courseModifications,*/}
                        {/*            add: courseModifications.add.filter(c => c !== course)*/}
                        {/*        });*/}
                        {/*    }}>Delete</Button>*/}
                        {/*</div>))}*/}
                        {(courseModifications.add.length || courseModifications.delete.length) ? <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                            className="w-full h-8" onClick={save}>
                            Save
                        </Button> : null}
                    </div>

                    <div className="bg-white rounded px-4 pb-3 pt-4 text-black w-full mt-3">
                        <div className="text-2xl">Planned Degrees</div>
                        {degreePlan.degrees.map((degree, i) => (<div key={i} className="flex items-center py-2 border-b border-gray-300">
                            <Link to={`/major_requirements?id=${degree._id}`} className="mr-auto">{degree.type[0].toUpperCase()}{degree.type.slice(1)} in {degree.name}</Link>
                            <Button variant="contained" color="secondary" onClick={() => {
                                setDegreePlan({
                                    ...degreePlan,
                                    degrees: degreePlan.degrees.filter(x => x !== degree)
                                });
                                setDegreeModifications({
                                    ...degreeModifications,
                                    delete: [...degreeModifications.delete, degree._id]
                                });
                            }}>Delete</Button>
                        </div>))}
                        {degreeModifications.add.map((degree, i) => (<div key={i} className="flex items-center py-2 border-b border-gray-300">
                            <Link to={`/major_requirements?id=${degree._id}`} className="mr-auto">{degree.type[0].toUpperCase()}{degree.type.slice(1)} in {degree.name}</Link>
                            <Button variant="contained" color="secondary" onClick={() => {
                                setDegreeModifications({
                                    ...degreeModifications,
                                    add: degreeModifications.add.filter(c => c !== degree)
                                });
                            }}>Delete</Button>
                        </div>))}
                        {(degreeModifications.add.length || degreeModifications.delete.length) ? <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                            className="w-full h-8" onClick={save}>
                            Save
                        </Button> : null}
                    </div>
                </>}
            </div>
        </div>

    </Layout>);
}