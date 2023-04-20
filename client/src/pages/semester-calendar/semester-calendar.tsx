import { Button, Card, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import { Layout } from "../../components/layout/layout";
import { CSSProperties, useEffect, useRef, useState } from "react";
import SemesterService from "../../services/SemesterService";
import { Semester } from "../../types/semester";
import { DegreePlan } from "../../types/degree-plan";
import DegreePlanService from "../../services/DegreePlanService";
import { UserCourse } from "../../types/user-course";
import "./semester-calendar.css";
import { Meeting } from "../../types/course-requirements";
import { Link } from "react-router-dom";
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";

export function SemesterCalendar() {
    // Constant config options
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const colors = ["rgb(227, 23, 10)", "rgb(169, 229, 187)", "rgb(252, 246, 177)", "rgb(247, 179, 43)", "rgb(56, 145, 166)", "rgb(154, 196, 248)", "rgb(171, 146, 191)", "rgb(175, 77, 152)", "rgb(89, 210, 254)", "rgb(56, 102, 65)", "rgb(134, 22, 87)"];
    const operatingHours = ["7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];

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
    const [coursesByDay, setCoursesByDay] = useState<JSX.Element[][]>([[], [], [], [], [], [], []]);
    const [selectedWeek, setSelectedWeek] = useState<Date>();
    const [dateBounds, setDateBounds] = useState<(Date | undefined)[]>([undefined, undefined]);
    const [timeBounds, setTimeBounds] = useState<(Date | undefined)[]>([undefined, undefined]);

    // Get a Date object from a time string
    function parseTime(time: string): Date {
        return new Date(0, 0, 0, 
            Number(time.split(":")[0])%12 + (time.split(" ")[1] === "PM" ? 12 : 0),
            Number(time.split(":")[1].split(" ")[0]));
    }

    function parseDate(date: string): Date {
        const {0: month, 1: day, 2: year} = date.split("/");
        return new Date(parseInt(year), parseInt(month)-1, parseInt(day));
    }
    
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
        var dateBounds: (Date | undefined)[] = [undefined, undefined];
        var timeBounds: (Date | undefined)[] = [undefined, undefined];
        degreePlans[degreePlan].courses.forEach(course => {
            if (course.semester) {
                if (course.semester === selectedSem && course.year === selectedYear) {
                    courses.push(course);

                    // Update date/time bounds
                    if (course.section) {
                        course.section.meetings.forEach((meeting: Meeting) => {
                            // Update date bounds
                            var startDate: Date = parseDate(meeting.startDate);
                            var endDate: Date = parseDate(meeting.endDate);
                            if (!dateBounds[0] || startDate < dateBounds[0]) dateBounds[0] = startDate;
                            if (!dateBounds[1] || endDate > dateBounds[1]) dateBounds[1] = endDate;

                            // Update time bounds
                            var startTime: Date = parseTime(meeting.startTime);
                            startTime.setMinutes(startTime.getMinutes()-30);
                            startTime.setMinutes(0);
                            var endTime: Date = parseTime(meeting.endTime);
                            endTime.setMinutes(60);
                            if (!timeBounds[0] || startTime < timeBounds[0]) timeBounds[0] = startTime;
                            if (!timeBounds[1] || endTime > timeBounds[1]) timeBounds[1] = endTime;
                        });
                    } else {
                        //TODO: Add support for courses with no section
                    }
                }
            }
        });

        // Set selected week to first day of semester
        if (dateBounds[0]) {
            var firstDay: Date = new Date(dateBounds[0].getTime());
            firstDay.setDate(firstDay.getDate() - dateBounds[0].getDay());
            setSelectedWeek(firstDay);
        }

        // Update state
        setDateBounds(dateBounds);
        setTimeBounds(timeBounds);
        setCourses(courses);
    }, [semester, degreePlan, degreePlans]);

    // Load courses to internal array by day
    useEffect(() => {
        // Get the name of the instructor for a section meeting time
        function getInstructorName(meeting: Meeting): string {
            if (meeting.instructors.length == 0) return "TBA";
            if (meeting.instructors[0].nickname) return meeting.instructors[0].lastname + ", " + meeting.instructors[0].nickname;
            return meeting.instructors[0].lastname + ", " + meeting.instructors[0].firstname;
        }

        if (!timeBounds[0] || !timeBounds[1]) return; // Skip if no time bounds (no courses)

        // Iterate through added courses
        var coursesByDay: JSX.Element[][] = [[], [], [], [], [], [], []];
        var colorMap: Map<string, string> = new Map();
        courses.forEach((course: UserCourse, i: number) => {
            // Get course color
            var color: string;
            if (colorMap.has(course.courseData._id)) {
                color = colorMap.get(course.courseData._id) ?? "";
            } else {
                color = colors[colorMap.size % colors.length];
                colorMap.set(course.courseData._id, color);
            }

            // Add courses that have a selected section
            if (course.section) {
                if (course.section.meetings.length == 0) return; // Skip courses with no meetings

                // Iterate through meetings
                course.section.meetings.forEach((meeting: Meeting, j: number) => {
                    // Calculate meeting height and top offset
                    const start = parseTime(meeting.startTime);
                    const end = parseTime(meeting.endTime);
                    const duration = (end.getTime() - start.getTime()) / 1000 / 60;
                    const top = (start.getTime() - (timeBounds[0]?.getTime() ?? 0)) / 1000 / 60;

                    // Iterate through days in meeting
                    meeting.days.forEach((day: string) => {
                        // Add meeting to day
                        var dayIndex: number = days.findIndex(d => d.toLocaleLowerCase().includes(day.toLocaleLowerCase()));
                        if (dayIndex < 0) return; // Skip days that are not in the calendar

                        // Check if meeting in current week
                        if (!selectedWeek) return; // Exit if no week selected
                        var date: Date = new Date(selectedWeek.getTime());
                        date.setDate(date.getDate() + dayIndex); // Set date to day of week
                        if (date < parseDate(meeting.startDate) || date > parseDate(meeting.endDate)) return;

                        // Add meeting to day
                        coursesByDay[dayIndex].push(<div key={parseInt(`${i}${j}${dayIndex}`)}>
                            <div 
                                className="CourseStyle"
                                style={{top: top+"px", height: duration+"px", backgroundColor: color}}
                            >
                                <Link to={`/course_description?subject=${course.subject}&courseID=${course.courseID}`}>
                                    <p className="courseName">{course.subject+" "+course.courseID+": "+course.courseData.name}</p>
                                </Link>
                                <p className="courseDetails">{meeting.location}</p>
                                <p className="courseDetails">{getInstructorName(meeting)}</p>
                                <p className="courseDetails">{meeting.startTime+"-"+meeting.endTime}</p>
                                <p className="courseDetails">{meeting.startDate+"-"+meeting.endDate}</p>
                            </div>
                            <div className="tooltip" style={{
                                top: top+"px",
                                left: dayIndex < 4 ? "100%" : "",
                                right: dayIndex < 4 ? "" : "100%"
                            }}>
                                <p className="courseName">{course.courseData.subject+" "+course.courseData.courseID+": "+course.courseData.name}</p>
                                <p className="courseName">{meeting.location}</p>
                                <p className="courseName">{getInstructorName(meeting)}</p>
                                <p className="courseName">{meeting.startTime+"-"+meeting.endTime}</p>
                                <p className="courseName">{meeting.startDate+"-"+meeting.endDate}</p>
                            </div>
                        </div>);
                    });
                });
            }

            //TODO: Add courses that have no selected section
        });
        setCoursesByDay(coursesByDay);
    }, [courses, selectedWeek]);
    
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

        function weekModifier(): (undefined | JSX.Element) {
            if (!selectedWeek || !dateBounds[0] || !dateBounds[1]) return;

            const prevDate = new Date(selectedWeek.getTime());
            prevDate.setDate(prevDate.getDate() - 7);
            const nextDate = new Date(selectedWeek.getTime());
            nextDate.setDate(nextDate.getDate() + 7);
            const endWeek = new Date(selectedWeek.getTime());
            endWeek.setDate(endWeek.getDate() + 6);

            return (
                <div className="flex items-center">
                    <IconButton size="small" disabled={prevDate < dateBounds[0]} onClick={() => setSelectedWeek(prevDate)}>
                        <AiOutlineLeft />
                    </IconButton>
                    <p>{selectedWeek.toDateString().substring(4)} - {endWeek.toDateString().substring(4)}</p>
                    <IconButton size="small" disabled={nextDate > dateBounds[1]} onClick={() => setSelectedWeek(nextDate)}>
                        <AiOutlineRight />
                    </IconButton>
                </div>
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
                <div className="mr-6">
                    {weekModifier()}
                </div>
            </div>
        );
    }

    function renderCalendar(): JSX.Element {
        // Print error if not displayable
        if (!semester) return (<div className="text-center">Semester not found</div>);
        if (!coursesByDay || !selectedWeek || !timeBounds[0] || !timeBounds[1]) return (<div className="text-center">No courses selected for this semester</div>);

        // Generate column of time markers and background grid
        var timeBlocks: JSX.Element[] = []
        var calendarGrid: JSX.Element[] = [];
        for (var i: number = timeBounds[0].getHours(); i < timeBounds[1].getHours(); i++) {
            timeBlocks.push(
                <div className="blockStyle">
                    {(i%12+1) + (i < 12 ? "AM" : "PM")}
                </div>
            );
            calendarGrid.push(
                <div className="MajorGridStyle" style={{top: (60*(i-timeBounds[0].getHours()))+"px"}}>
                    <div className="MinorGridStyle" style={{top: "15px"}} />
                    <div className="MinorGridStyle" style={{top: "30px"}} />
                    <div className="MinorGridStyle" style={{top: "45px"}} />
                </div>
            );
        }

        const columns = days.map((day, i) => (
            <div style={colWidth}>
                <CardHeader title={day.substring(0,3)} className="text-center h-12 rad-4 bg-neutral-700 text-white" />
                <div className="dayStyle">
                    {calendarGrid}
                    {coursesByDay[i]}
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
