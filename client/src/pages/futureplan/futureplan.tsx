import { Layout } from '../../components/layout/layout';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import React, { useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {FaChevronDown, FaMinus, FaPlus, FaSearch} from 'react-icons/fa';
import { ApiCourse, Meeting, Requirement } from '../../types/course-requirements';
import CourseService from '../../services/CourseService';
import { Degree } from '../../types/degree';
import DegreeService from '../../services/DegreeService';
import CourseHistoryService from '../../services/CourseHistoryService';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem, Modal,
    Select, Tooltip
} from '@material-ui/core';
import { DegreePlan } from '../../types/degree-plan';
import DegreePlanService from '../../services/DegreePlanService';
import { UserCourse } from '../../types/user-course';
import { Section } from '../../types/course-requirements';
import { ApiProfessor } from '../../types/professor';
import { Semester } from '../../types/semester';
import SemesterService from '../../services/SemesterService';
import GPAService from '../../services/GPAService';
import { CourseLink } from '../../components/course-link/course-link';
import { SCHEDULE_ORDER, SCHEDULE_TYPES } from '../../types/schedule-type';
import { ProcessedEvent, Scheduler } from "@aldabil/react-scheduler";
import { Api } from '../../services/Api';

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
    const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());

    const [createNewPlan, setCreateNewPlan] = useState(false);


    const nameRef = useRef({ value: '' });
    const searchRef = useRef({ value: '' });
    const [createSem, setSem] = useState(false);
    const yearRef = useRef({ value: '' });
    const [overidden, setOverride] = useState(false);
    const [overClass, setOverClass] = useState<{courseID: string, subject: string}[] | null>(null);
    const [semCourse, setSemCourse] = useState<ApiCourse>();
    const [selectedSem, setSelectedSem] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<Section[] | null>(null);
    const [modifyCourse, setModifyCourse] = useState<UserCourse | null>(null);
    const [instructorFilter, setInstructorFilter] = useState<string>('');

    const [semesterFilter, setSemesterFilter] = useState<string>('');
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [hoveringSection, setHoveringSection] = useState<Section | null>(null);

    const [cumulativeGpa, setCumulativeGpa] = useState<number | null>(null)
    const [semesterGpa, setSemesterGpa] = useState<number | null>(null)
    const [selectedGpaSemester, setSelectedGpaSemester] = useState('');

    const [degreeSearch, setDegreeSearch] = useState('');
    
    const [recs, setRecs] = useState<{uniqueID: string, courseID: string, subject: string}[] | null>(null);
    const [reccomended, setReccomended] = useState<{_id: string, courseID: string, subject: string}[] | null>(null);

    const [showWarning, setWarning] = useState(false);
    const [overrideCo, setOverrideCo] = useState<{courseID: string, subject: string}[] | null>(null);

    
    const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
    const [sems, setSems] = useState<Semester[]>([]);


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

    // const setSelectedGpaSemester = (g : string) =>{
    //     //semesters.forEach()
    // }
    
    const recc = () => {
        console.log(degreePlan?._id);
        DegreePlanService.getRecommendations(degreePlan!._id).then(res =>{console.log(res); setReccomended(res.recommendations)});
        console.log(reccomended);
        /*try {
            console.log("reached");
            console.log(degreePlan?._id);
            //await 
        } catch {
            //alert('Failed to update: ' + ((e as any)?.message ?? e)); // it is 4 am and i do not want to style this more
        }*/
    }

    const flatten = (reqs : any) => {
        if (reqs.type === 'group') return reqs.children.map(flatten).flat(Infinity);
        else if (reqs.type === 'course') return reqs
    }

    const checkOverride = (course: ApiCourse, sem:Semester) => {
        //for (let i = 0; i < course.)
        
        //const requ = course.requirements;
        //const list = flatten(requ);

        //let met = 0;
        // let mystery = degreePlan;
        // mystery!.courses.forEach(var => {
        //     degreePlan!.courses.forEach(cour => {
        //         if (cour.year > var.year || (cour.year == var.year && (cour.semester.localeCompare(var.semester) > 1))) {
        //             if (cour)
        //         }
        //     });
        // })

        if (course.maxCredits < 3) {
            return false;
        }

        if (sem.term.localeCompare("Spring") == 0) {
            return false;
        }

        //setOverride
        
        return true;
    }

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
        //
        
        // DegreePlanService.getRecommendations(degreePlan!._id).then(res =>{setRecs(res.recs)});
        SemesterService.getSemesters().then(res => setSemesters(res));
        GPAService.getCumulativeGPA().then(res => setCumulativeGpa(res));
    }, []);

    useEffect(() => {
        CourseHistoryService.getCourses()
            .then(res => setUserCourses(res.courses));

        SemesterService.getSemesters().then(res => setSems(res));
    }, []);

    // useEffect(() => {
    //     DegreePlanService.getRecommendations(degreePlan!._id).then(res =>{console.log(res); setReccomended(res.recommendations)});
    // })

    useEffect(() => {
        const sem = semesters.find(({ _id }) => _id === setSelectedGpaSemester);
        if (sem)
        GPAService.getSemesterGPA({ semesterInput: sem?.semester , yearInput: sem?.year })
            .then(res => setSemesterGpa(res))
        else setSemesterGpa(null);
    }, [setSelectedGpaSemester]);

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
    }, [selectedSem, semCourse]);

    const selectedSectionSet = new Set<string>();
    selectedSection?.forEach(s => selectedSectionSet.add(s._id));

    const previewSectionCalendar: JSX.Element | null = useMemo(() => {
        if (!createSem) return null;
        if (!selectedSection) return null;
        if (!section.length) return <span>No sections found</span>;

        const startDate = section.flat(2).flatMap(s => s.meetings)
            .reduce((earliest, current) => {
                if (!current.startDate) return earliest;
                const earliestDate = new Date(earliest.startDate);
                const currentDate = new Date(current.startDate);
                if (currentDate < earliestDate) return current;
                return earliest;
            });

        if (!startDate.startDate)
            return <span>No dates found</span>;

        let selectedDate = new Date(startDate.startDate);
        if (selectedDate.getDay() !== 1) {
            const dayOffset = selectedDate.getDay() - 1;
            selectedDate = new Date(Date.parse(selectedDate as any) - dayOffset * 86400000);
        }

        const getDate = (day: string, time: string) => {
            const dayIndex = ['M', 'T', 'W', 'R', 'F'].indexOf(day);
            if (dayIndex === -1) return null;
            const dayDate = new Date(Date.parse(selectedDate as any) + dayIndex * 86400000);
            let [, hours, mins, amPm] = time.toLowerCase().match(/^(\d+):(\d+)\s+([ap]m)$/i) ?? [];
            if (!hours) return null;
            if (amPm === 'pm' && hours !== '12') hours = ''+(+hours + 12);

            return new Date(dayDate.setHours(+hours, +mins, 0, 0));
        };
        
        const events: ProcessedEvent[] = [];
        const semester = semesters.find(sem => sem._id === selectedSem);
        let event_id = 0;

        const addMeetings = (course?: { courseID: string, subject: string } | null, section?: Section | null) => {
            if (!section || !course) return;

            section.meetings.forEach(meeting => {
                if (!(meeting.startTime && meeting.endTime && meeting.days?.length)) return;

                meeting.days.forEach(day => {
                    const start = getDate(day, meeting.startTime);
                    const end = getDate(day, meeting.endTime);

                    if (start && end)
                        events.push({
                            event_id: event_id++,
                            title: `${course.subject} ${course.courseID} ${section.name}`,
                            start,
                            end
                        })
                })
            });
        }

        if (semester)
            degreePlan?.courses.forEach(course => {
                if (!(course.semester === semester.semester && course.year === semester.year)) return;

                addMeetings(course, course.section);
            });

        if (hoveringSection) {
            selectedSection?.filter(s => s.scheduleType !== hoveringSection.scheduleType)
                .forEach(section => {
                    addMeetings(semCourse, section);
                })

            addMeetings(semCourse, hoveringSection);
        }

        return <Scheduler view="week" selectedDate={selectedDate} day={null} month={null} dialogMaxWidth={'sm'} direction="ltr" events={events}
                          week={{ weekDays: [1,2,3,4,5], weekStartOn: 0, startHour: 6, endHour: 18, step: 180 }}  fields={[]} height={0} locale={undefined}
                          resourceFields={undefined} resourceViewMode="tabs" resources={undefined} />;
    }, [createSem, selectedSection, selectedSem, section, degreePlan, semesters, hoveringSection]);

    const sectionAddError = useMemo(() => {
        let selectedGroups = section.filter(s => s.flat().find(s => selectedSectionSet.has(s._id)));
        const selectedGroup = selectedGroups[0];

        if (selectedGroup === undefined && section.length)
            return 'you must select some sections';

        if (selectedGroups.length > 1)
            return 'you must select from one group only';

        for (let i = 0; i < section.length; ++i) {
            const group = section[i];
            for (const sectionTypes of group) {
                const hasSelection = sectionTypes.some(section => selectedSectionSet.has(section._id));

                if (!hasSelection && selectedGroup === group)
                    return `you must select a ${sectionTypes[0].scheduleType} section from group ${i + 1}`;
            }
        }

        return '';
    }, [selectedSection, section])

    return (<Layout>
        <Dialog open={showWarning} onClose={() => setWarning(false)}>
            <DialogTitle>The prerequisites for this course have not been fulfilled!</DialogTitle>    
            <DialogActions>
                <Button onClick={() => setWarning(false)}>Cancel</Button>
                <Button onClick={() => {
                   //setSemCourse(course!);
                   setOverride(true);
                   setWarning(false);
                   console.log("here");
                    //TODO Update Integration 
                }}>Override</Button>
            </DialogActions>
        </Dialog>

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

        <Modal open={createSem} onClose={() => setSem(false)}>
            <div className="flex flex-col absolute left-1/2 top-1/2 w-3/4 h-3/4 bg-gray-200 rounded-md
                -translate-x-1/2 -translate-y-1/2 p-6 text-slate-800">
                <div className="text-2xl mb-2">Select Planned Semester</div>
                <Select fullWidth
                    value={selectedSem}
                    label="Semester"
                    onChange={ev => {
                        setSection([])
                        setSelectedSem(ev.target.value as string)
                        setSelectedSection([]);
                    }} >
                    {semCourse?.semesters?.filter(semester => semester.year >= new Date().getFullYear())
                        .map((semester) => (<MenuItem key={semester._id} value={semester._id}>
                        {semester.semester} {semester.year}
                    </MenuItem>))}
                </Select>

                {section.flat().length ? <>
                    <div className="mt-4 mb-2">Filter Instructors</div>

                    <Select fullWidth value={instructorFilter} MenuProps={{ className: 'max-h-96' }}
                                                 onChange={ev => {
                                                     setInstructorFilter(ev.target.value as string);
                                                     setSelectedSection([]);
                                                 }}>
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

                <hr className="w-full mt-6 mb-3 bg-slate-900" />

                {section.flat().length ? <div className="flex flex-col grow basis-0">
                    <div className="text-lg italic mb-2 flex items-center">
                        Choose a course group, and pick one section of each schedule type from each group
                        <Button className="ml-auto" onClick={() => {
                            if (hiddenSections.size)
                                setHiddenSections(new Set());
                            else
                                setHiddenSections(new Set(section.flat(2).map(s => s._id)));
                        }}>{hiddenSections.size ? 'Show' : 'Hide'} All</Button>
                    </div>

                    <div className="overflow-y-auto flex flex-col grow basis-0">
                        {section.filter(groups => {
                            if (!instructorFilter) return true;
                            const instructors = groups.flat(2).flatMap(s => s.meetings.flatMap(m => m.instructors));
                            return instructors.find(inst => inst._id === instructorFilter);
                        }).map((group, i) => <div key={i} className="mb-2">
                            <Accordion defaultExpanded={true}>
                                <AccordionSummary expandIcon={<FaChevronDown />}>
                                    <div className="text-xl">Group {i + 1}</div>
                                </AccordionSummary>
                                <AccordionDetails className="flex flex-col">
                                    {[...group].sort((a, b) => SCHEDULE_ORDER[a[0].scheduleType] - SCHEDULE_ORDER[b[0].scheduleType]).map((sections, i) => <div key={i} className="px-3 py-2 bg-gray-300 bg-opacity-25 mb-2 rounded-md">
                                        <div className="text-lg mb-1"><Tooltip arrow title={SCHEDULE_TYPES[sections[0].scheduleType as keyof typeof SCHEDULE_TYPES]}>
                                            <span>{sections[0].scheduleType}</span>
                                        </Tooltip> Schedule Type</div>
                                        {sections.map((section, i) => <Tooltip arrow placement="top" enterDelay={250}
                                                                               title={<div className="pointer-events-none -mx-6 -mb-12 -mt-20 scale-90 scale-y-75">{previewSectionCalendar}</div>}
                                                                               classes={{ tooltip: 'max-w-2xl overflow-hidden' }}>
                                            <div key={i} className={`p-1 border-gray-400 border rounded mb-1 cursor-pointer
                                            ${selectedSectionSet.has(section._id) ? 'bg-pink-400 bg-opacity-25' : ''}`}
                                                 onClick={() => {
                                                     if (selectedSectionSet.has(section._id))
                                                         setSelectedSection(selectedSection!.filter(s => s._id !== section._id))
                                                     else
                                                         setSelectedSection([...(selectedSection ?? []).filter(s => s.scheduleType !== section.scheduleType), section])
                                                 }} onMouseEnter={() => setHoveringSection(section)} onMouseLeave={() => setHoveringSection(null)}>
                                                <div className="flex items-center">{section.name} (CRN {section.crn}), {section.minCredits === section.maxCredits ?
                                                    `${section.minCredits} Credits` : `${section.minCredits}-${section.maxCredits} Credits`}

                                                    <div className="ml-auto" onClick={(ev) => {
                                                        if (hiddenSections.has(section._id))
                                                            setHiddenSections(new Set([...hiddenSections].filter(s => s !== section._id)))
                                                        else
                                                            setHiddenSections(new Set([...hiddenSections, section._id]));
                                                        ev.stopPropagation();
                                                    }}>
                                                        {hiddenSections.has(section._id) ? <FaPlus /> : <FaMinus />}
                                                    </div>
                                                </div>
                                                {!hiddenSections.has(section._id) && <div className="ml-2 grid" style={{
                                                    gridTemplateColumns: 'minmax(0, .5fr) minmax(0, .5fr) minmax(0, 1fr) minmax(0, .75fr) minmax(0, 1fr)'
                                                }}>
                                                    <div className="px-1 py-0.5 border border-gray-400 font-semibold">Time</div>
                                                    <div className="px-1 py-0.5 border border-gray-400 font-semibold">Days</div>
                                                    <div className="px-1 py-0.5 border border-gray-400 font-semibold">Location</div>
                                                    <div className="px-1 py-0.5 border border-gray-400 font-semibold">Date Range</div>
                                                    <div className="px-1 py-0.5 border border-gray-400 font-semibold">Instructors</div>

                                                    {section.meetings.map((meeting, i) => <React.Fragment key={i}>
                                                        <div className="px-1 py-0.5 border border-gray-400">{meeting.startTime && meeting.endTime ? `${meeting.startTime}-${meeting.endTime}` : 'TBA'}</div>
                                                        <div className="px-1 py-0.5 border border-gray-400">{meeting.days?.length ? meeting.days.join(', ') : 'TBA'}</div>
                                                        <div className="px-1 py-0.5 border border-gray-400">{meeting.location ?? 'TBA'}</div>
                                                        <div className="px-1 py-0.5 border border-gray-400">{meeting.startDate && meeting.endDate ? `${meeting.startDate}-${meeting.endDate}` : 'TBA'}</div>
                                                        <div className="px-1 py-0.5 border border-gray-400">{meeting.instructors.length ? meeting.instructors.map((ins, i) => <Link to={'/'}>
                                                            {ins.firstname} {ins.lastname}
                                                        </Link>) : 'TBA'}</div>
                                                    </React.Fragment>)}
                                                </div>}
                                            </div>
                                        </Tooltip>)}
                                    </div>)}
                                </AccordionDetails>
                            </Accordion>
                        </div>)}
                    </div>
                </div> : <div>No sections available</div>}

                <div className="mt-auto pt-2 flex">
                    {sectionAddError && <span className="text-red-500 mt-auto">Error: {sectionAddError}</span>}
                    <Button variant="contained" className="mr-2 ml-auto" onClick={() => {
                        setSem(false);
                        setSelectedSection(null);
                    }}>Cancel</Button>
                    <Button variant="contained" color="secondary" disabled={sectionAddError !== '' || !section.length} onClick={() => {
                        const now = Date.now();
                        const semesters = semCourse?.semesters.find(o => o._id === selectedSem);
                        if (!semCourse || !semesters) {
                            console.log(semCourse, semesters)
                            setSem(false);
                            setSelectedSection(null);
                            return;
                        }

                        if (checkOverride(semCourse, semesters)) {
                            setWarning(true);
                            if (overidden) {
                                setCourseModifications({
                                    ...courseModifications,
                                    add: [...courseModifications.add, ...(selectedSection?.map((s, i) => {
                                        return {
                                            _id: '' + (now + i),
                                            subject: semCourse.subject,
                                            courseID: semCourse.courseID,
                                            semester: semesters.semester,
                                            grade: 'A',
                                            year: semesters.year,
                                            section: s,
                                            courseData: {  ...semCourse, sections: section }
                                        }
                                    }).filter(x => x) ?? [])]
                                });
                                setOverride(false);
                                console.log("reached");
                            }
                        } else {
                            setCourseModifications({
                                ...courseModifications,
                                add: [...courseModifications.add, ...(selectedSection?.map((s, i) => {
                                    return {
                                        _id: '' + (now + i),
                                        subject: semCourse.subject,
                                        courseID: semCourse.courseID,
                                        semester: semesters.semester,
                                        grade: 'A',
                                        year: semesters.year,
                                        section: s,
                                        courseData: {  ...semCourse, sections: section }
                                    }
                                }).filter(x => x) ?? [])]
                            })
                        }
                        setSem(false);
                        setSelectedSection(null);
                    }}>
                        Save
                    </Button>
                </div>
            </div>
        </Modal>

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


                    {/* <span className="mr-2">Semester:</span> */}
                    {/* <Select value={selectedGpaSemester} onChange={ev => setSelectedGpaSemester(ev.target.value as string)}>
                        {semesters.map(sem => <MenuItem key={sem._id} value={sem._id}>
                            {sem.semester} {sem.year}
                        </MenuItem>)}
                    </Select> */}

                    <div className="flex">
                        <span className="mr-4">
                            Cumulative GPA: {cumulativeGpa === null ? 'N/A' : cumulativeGpa.toFixed(2)}
                        </span>
                        {/* <span>
                            Semester GPA: {semesterGpa === null ? 'N/A' : semesterGpa.toFixed(2)}
                        </span> */}
                    </div>

                </div>

                <div className="bg-white rounded px-4 pb-3 pt-4 text-black w-full overflow-auto h-96">
                <div className="text-2xl">Course Recommendations</div>

                <Button variant="contained" color="secondary" onClick={recc}>Generate Reccomendations</Button>
                
                {reccomended?.map((rec, i) => (<div
                        className="w-full py-3 px-4 border-y flex items-center" key={i}>
                        <CourseLink className="mr-auto" courseID={rec.courseID} subject={rec.subject} useColor={false} />
                        {/* <Link to={`/course_description?subject=${rec.subject}&courseID=${rec.courseID}`} className="mr-auto">{rec.subject} {rec.courseID}</Link> */}
                        
                    </div>))}
                </div>

                <div className="bg-white rounded px-4 pb-3 mt-4 pt-4 text-black w-full">
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
                        <CourseLink className="mr-auto" courseID={course.courseID} subject={course.subject} useColor={false} />
                        <Button color="inherit" onClick={() => {
                            setSemCourse(course);
                            setSem(true);
                            setSelectedSem(null);
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
            <div className="bg-white rounded px-4 pb-3 pt-4 text-black w-full overflow-auto h-96">
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
                        <Link to={`/major_requirements?id=${degree._id}`} className="mr-auto">{degree.name}</Link>
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
                            <div className="text-2xl mr-auto">Selected Courses</div>
                            <div><span>Semester filter:&nbsp;</span>
                                <Select value={semesterFilter} onChange={ev => {console.log(ev.target.value as string); setSemesterFilter(ev.target.value as string); setSelectedGpaSemester(ev.target.value as string)}}>
                                    
                                    <MenuItem value={""}>None</MenuItem>
                                    {/* {semesters.map(sem => <MenuItem key={sem._id} value={sem._id}>
                                    {sem.semester} {sem.year} */}
                                    {/* </MenuItem>)} */}
                                    {[...new Set([degreePlan.courses, userCourses, courseModifications.add]
                                        .flat().map(c => `${c.semester} ${c.year}`))].map((sem, i) => <MenuItem key={sem} value={sem}>
                                        {sem} 
                                    </MenuItem>)}
                                    
                                </Select>
                                <span>
                                     Semester GPA: {semesterGpa === null ? 'N/A' : semesterGpa.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        {Object.entries([degreePlan.courses, userCourses, courseModifications.add]
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
                                <CourseLink courseID={course.courseID} subject={course.subject} useColor={false} />

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
