import { Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import { Layout } from "../../components/layout/layout";
import { useEffect, useRef, useState } from "react";
import SemesterService from "../../services/SemesterService";
import { Semester } from "../../types/semester";
import { DegreePlan } from "../../types/degree-plan";
import DegreePlanService from "../../services/DegreePlanService";
import { UserCourse } from "../../types/user-course";
import "./semester-calendar.css";

export function SemesterCalendar() {
    // Semester Selection
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
    const degreePlan = useRef<DegreePlan>();
    const [courses, setCourses] = useState<UserCourse[]>([]);
    
    // Get semesters and degree plans from database on page load
    useEffect(() => {
        DegreePlanService.getPlans().then(res => setDegreePlans(res.degreePlans));
        SemesterService.getSemesters().then(res => setSemesters(res));
    }, []);

    // Get degree plan for selected degree plan
    useEffect(() => {
        if (degreePlans.length > 0) degreePlan.current = degreePlans[0];
        else degreePlan.current = undefined;
    }, [degreePlans]);

    // Update semester when semester or year is changed
    useEffect(() => {
        setSemester(semesters.find(s => s.semester === selectedSem && s.year === selectedYear));
    }, [selectedSem, selectedYear, semesters]);

    // Get courses for selected degreeplan and semester
    useEffect(() => {
        if (!degreePlan.current) return;
        var courses: UserCourse[] = [];
        degreePlan.current.courses.forEach(course => {
            if (course.semester) {
                if (course.semester === selectedSem && course.year === selectedYear) courses.push(course);
            }
        });
        setCourses(courses);
    }, [semester, degreePlan.current]);
    
    // Render semester selection with error if semester is not found
    function renderSemesterSelection(): (undefined | JSX.Element) {
        const semesterOptions = ["Spring", "Summer", "Fall", "Winter"].map(semester => (<MenuItem value={semester}>{semester}</MenuItem>));
        
        // Render semester select with error if semester is not found
        function semesterSelect(): (undefined | JSX.Element) {
            if (semester) return (
                <FormControl>
                    <InputLabel id="semester-select">Semester</InputLabel>
                    <Select
                        id="outlined-input"
                        className="example"
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
                        className="example"
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
                    {semesterSelect()}
                </div>
                <div className="mr-6">
                    {yearTextField()}
                </div>
            </div>
        );
    }

    function renderCalendar(): JSX.Element {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const colors = ["rgb(227, 23, 10)", ];

        // Generate column of time markers
        const operatingHours = ["7:00am", "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm", "5:00pm"];
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

        // Generate columns for each day
        const columns = days.map((day, i) => (
            <div className="w-full">
                <CardHeader title={day} className="text-center h-12 rad-4 bg-neutral-700 text-white" />
                <div className="dayStyle">
                    {calendarGrid}
                </div>
            </div>
        ));
        
        // Combine elements into one element
        return (
            <div className="flex mt-6">
                <div className="inline-block h-full">
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
