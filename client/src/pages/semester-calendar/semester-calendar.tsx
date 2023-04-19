import { Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import { Layout } from "../../components/layout/layout";
import { CSSProperties, useEffect, useRef, useState } from "react";
import SemesterService from "../../services/SemesterService";
import { Semester } from "../../types/semester";
import { DegreePlan } from "../../types/degree-plan";
import DegreePlanService from "../../services/DegreePlanService";
import { UserCourse } from "../../types/user-course";
import "./semester-calendar.css";
import { Meeting } from "../../types/course-requirements";

export function SemesterCalendar() {
    const [selectedSem, setSem] = useState<string>((): string => {
        const date = new Date();
        if (date.getMonth() <= 4) return "Spring";
        else if (date.getMonth() <= 7) return "Summer";
        else if (date.getMonth() <= 11) return "Fall";
        else return "Winter";
    });
    const [selectedYear, setYear] = useState<number>(new Date().getFullYear());
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [semester, setSemester] = useState<Semester>();
    const [degreePlans, setDegreePlans] = useState<DegreePlan[]>([]);
    const [degreePlan, setDegreePlan] = useState<number>(0);
    const [courses, setCourses] = useState<UserCourse[]>([]);
    const [colWidth, setColWidth] = useState<CSSProperties>({ width: "14%" });
    const [hoveredMeeting, setHoveredMeeting] = useState<string>();
    
    // Get semesters and degree plans from database on page load and set event listeners
    useEffect(() => {
        DegreePlanService.getPlans().then(res => setDegreePlans(res.degreePlans));
        SemesterService.getSemesters().then(res => setSemesters(res));
        
        // Set and update column size on page load and window resize
        window.addEventListener("resize", () => {
            const parentWidth: number = document.getElementById("calendar")?.offsetWidth ?? 0;
            const timeLabelsWidth: number = document.getElementById("timeLabels")?.offsetWidth ?? 0;
            setColWidth({
                width: 100*(parentWidth - timeLabelsWidth) / 7 / parentWidth + "%",
            });
        });
    }, []);

    // Update semester when semester or year is changed
    useEffect(() => {
        setSemester(semesters.find(s => s.semester === selectedSem && s.year === selectedYear));
    }, [selectedSem, selectedYear, semesters]);

    // Get courses for selected degreeplan and semester
    useEffect(() => {
        if (degreePlans.length === 0) return;
        var courses: UserCourse[] = [];
        degreePlans[degreePlan].courses.forEach(course => {
            if (course.semester) {
                if (course.semester === selectedSem && course.year === selectedYear) courses.push(course);
            }
        });
        setCourses(courses);
    }, [semester, degreePlan, degreePlans]);
    
    // Render semester selection with error if semester is not found
    function renderSemesterSelection(): (undefined | JSX.Element) {
        const semesterOptions = ["Spring", "Summer", "Fall", "Winter"].map(semester => (<MenuItem value={semester}>{semester}</MenuItem>));
        
        // Render degree plan select
        function degreePlanSelect(): (undefined | JSX.Element) {
            return (
                <FormControl>
                    <InputLabel id="degree-plan-select">Degree Plan</InputLabel>
                    <Select
                        id="outlined-input"
                        labelId="degree-plan-select"
                        value={degreePlan}
                        onChange={e => setDegreePlan(e.target.value as number)}
                    >
                        {degreePlans.map((plan, i) => (<MenuItem value={i}>{plan.name}</MenuItem>))}
                    </Select>
                </FormControl>
            );
        }

        // Render semester select with error if semester is not found
        function semesterSelect(): (undefined | JSX.Element) {
            if (semester) return (
                <FormControl>
                    <InputLabel id="semester-select">Semester</InputLabel>
                    <Select
                        id="outlined-input"
                        labelId="semester-select"
                        value={selectedSem}
                        onChange={e => {setSem(e.target.value as string);}}
                    >
                        {semesterOptions}
                    </Select>
                </FormControl>
            );
            else return (
                <FormControl>
                    <InputLabel error id="semester-select">Semester</InputLabel>
                    <Select
                        error
                        id="outlined-input"
                        labelId="semester-select"
                        value={selectedSem}
                        onChange={e => {setSem(e.target.value as string);}}
                    >
                        {semesterOptions}
                    </Select>
                </FormControl>
            );
        }

        // Render year text field with error if semester is not found
        function yearTextField(): (undefined | JSX.Element) {
            if (semester) return (
                <TextField
                    id="year"
                    style={{ width: 60 }}
                    type="number"
                    label="Year"
                    value={selectedYear}
                    onChange={e => {setYear(Number(e.target.value));}}
                />
            );
            else return (
                <TextField
                    error
                    id="year"
                    style={{ width: 60 }}
                    type="number"
                    label="Year"
                    value={selectedYear}
                    onChange={e => {setYear(Number(e.target.value));}}
                />
            );
        }

        // Render semester selection
        return (
            <div className="flex items-center">
                <div className="ml-2 mr-6">
                    {degreePlanSelect()}
                </div>
                <div className="mr-6">
                    {semesterSelect()}
                </div>
                <div className="mr-6">
                    {yearTextField()}
                </div>
            </div>
        );
    }

    function renderCalendar(): JSX.Element {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const colors = ["rgb(227, 23, 10)", "rgb(169, 229, 187)", "rgb(252, 246, 177)", "rgb(247, 179, 43)", "rgb(56, 145, 166)", "rgb(154, 196, 248)", "rgb(171, 146, 191)", "rgb(175, 77, 152)", "rgb(89, 210, 254)", "rgb(56, 102, 65)", "rgb(134, 22, 87)"];
        const operatingHours = ["7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];

        // Get the name of the instructor for a section meeting time
        function getInstructorName(meeting: Meeting): string {
            if (meeting.instructors.length == 0) return "TBA";
            if (meeting.instructors[0].nickname) return meeting.instructors[0].lastname + ", " + meeting.instructors[0].nickname;
            return meeting.instructors[0].lastname + ", " + meeting.instructors[0].firstname;
        }

        // Generate column of time markers
        const timeBlocks = operatingHours.map((hour, i) => (
            <div className="blockStyle">
                {hour}
            </div>
        ));

        // Generate grid for each day
        const calendarGrid = operatingHours.map((hour, i) => (
            <div className="MajorGridStyle" style={{top: (60*i)+"px"}}>
                <div className="MinorGridStyle" style={{top: "15px"}} />
                <div className="MinorGridStyle" style={{top: "30px"}} />
                <div className="MinorGridStyle" style={{top: "45px"}} />
            </div>
        ));

        // Populate course times for each day
        //TODO: Check date boundaries for different weeks
        function populateCourses(day: number): JSX.Element[] {
            function parseTime(time: string): Date {
                return new Date(0, 0, 0, 
                    Number(time.split(":")[0])%12 + (time.split(" ")[1] === "PM" ? 12 : 0),
                    Number(time.split(":")[1].split(" ")[0]));
            }

            var meetings: JSX.Element[] = [];
            courses.forEach((course, i) => {
                if (!course.section || course.section.meetings.length == 0) return;
                
                course.section?.meetings.forEach((meeting, j) => {
                    if (meeting.days.find(d => days[day].startsWith(d))) {
                        const start = parseTime(meeting.startTime);
                        const end = parseTime(meeting.endTime);
                        const duration = (end.getTime() - start.getTime()) / 1000 / 60;
                        const top = (start.getTime() - (new Date(0,0,0,7)).getTime()) /1000 / 60;
                        meetings.push(<>
                            <div 
                                className="CourseStyle"
                                style={{top: top+"px", height: duration+"px", backgroundColor: colors[i%colors.length]}}
                                onMouseOver={() => {setHoveredMeeting(course._id+j+day);}}
                                onMouseOut={() => {setHoveredMeeting(undefined);}}
                            >
                                <p className="courseName">{course.courseData.subject+" "+course.courseData.courseID+": "+course.courseData.name}</p>
                                <p className="courseDetails">{meeting.location}</p>
                                <p className="courseDetails">{getInstructorName(meeting)}</p>
                                <p className="courseDetails">{meeting.startTime+"-"+meeting.endTime}</p>
                                <p className="courseDetails">{meeting.startDate+"-"+meeting.endDate}</p>
                            </div>
                            <div className="tooltip" style={{display: hoveredMeeting === course._id+j+day ? 'flex' : 'none', top: top+"px"}}>
                                <p className="courseName">{course.courseData.subject+" "+course.courseData.courseID+": "+course.courseData.name}</p>
                                <p className="courseName">{meeting.location}</p>
                                <p className="courseName">{getInstructorName(meeting)}</p>
                                <p className="courseName">{meeting.startTime+"-"+meeting.endTime}</p>
                                <p className="courseName">{meeting.startDate+"-"+meeting.endDate}</p>
                            </div>
                        </>);
                    }
                });
            });
            return meetings;
        }

        const columns = days.map((day, i) => (
            <div style={colWidth}>
                <CardHeader title={day} className="text-center h-12 rad-4 bg-neutral-700 text-white" />
                <div className="dayStyle">
                    {calendarGrid}
                    {populateCourses(i)}
                </div>
            </div>
        ));
        
        // Combine elements into one element
        return (
            <div id="calendar" className="flex mt-6">
                <div id="timeLabels" className="inline-block h-full">
                    <CardHeader className="h-12 w-0" />
                    {timeBlocks}
                </div>
                {columns}
            </div>
        );
    }

    // Render page
    return (<Layout>
        {/* Main body */}
        <div className="overfill-auto flex flex-grow h-full">
            {/* Resize card div to body */}
            <div className="w-full h-full ml-1 items-center justify-right">
                {/* Main calendar view */}
                <Card className="mt-4">
                    <CardHeader title="Semester Calendar" className="text-center h-10 bg-zinc-800 text-white" />
                    <CardContent>
                        {renderSemesterSelection()}
                        {renderCalendar()}
                    </CardContent>
                </Card>
            </div>
        </div>
    </Layout>);
};
