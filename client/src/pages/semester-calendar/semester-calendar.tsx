import { Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import { Layout } from "../../components/layout/layout";
import { useEffect, useRef, useState } from "react";
import SemesterService from "../../services/SemesterService";
import { Semester } from "../../types/semester";

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
    
    // Get semesters from database on page load
    useEffect(() => {
        SemesterService.getSemesters().then(res => setSemesters(res));
    }, []);

    // Update semester when semester or year is changed
    useEffect(() => {
        setSemester(semesters.find(s => s.semester === selectedSem && s.year === selectedYear));
    }, [selectedSem, selectedYear, semesters]);

    // Get courses for selected semester
    useEffect(() => {
        //TODO: Get courses for semester and year
    }, [semester]);
    
    // Render semester selection with error if semester is not found
    function renderSemesterSelection(): (undefined | JSX.Element) {
        if (semester) return (
            <div className="flex items-center">
                {/* Select semester */}
                <FormControl className="ml-2 mr-6">
                    <InputLabel id="semester-select">Semester</InputLabel>
                    <Select
                        id="outlined-input"
                        className="example"
                        labelId="semester-select"
                        value={selectedSem}
                        onChange={e => {setSem(e.target.value as string);}}
                    >
                        <MenuItem value="Fall">Fall</MenuItem>
                        <MenuItem value="Winter">Winter</MenuItem>
                        <MenuItem value="Spring">Spring</MenuItem>
                        <MenuItem value="Summer">Summer</MenuItem>
                    </Select>
                </FormControl>
                {/* Select year */}
                <div className="mr-6">
                    <TextField
                        id="year"
                        style={{ width: 60 }}
                        type="number"
                        label="Year"
                        value={selectedYear}
                        onChange={e => {setYear(Number(e.target.value));}}
                    />
                </div>
            </div>);
        else return (
            <div className="flex items-center">
                {/* Select semester */}
                <FormControl className="ml-2 mr-6">
                    <InputLabel error id="semester-select">Semester</InputLabel>
                    <Select
                        error
                        id="outlined-input"
                        className="example"
                        labelId="semester-select"
                        value={selectedSem}
                        onChange={e => {setSem(e.target.value as string);}}
                    >
                        <MenuItem value="Fall">Fall</MenuItem>
                        <MenuItem value="Winter">Winter</MenuItem>
                        <MenuItem value="Spring">Spring</MenuItem>
                        <MenuItem value="Summer">Summer</MenuItem>
                    </Select>
                </FormControl>
                {/* Select year */}
                <div className="mr-6">
                    <TextField
                        error
                        id="year"
                        style={{ width: 60 }}
                        type="number"
                        label="Year"
                        value={selectedYear}
                        onChange={e => {setYear(Number(e.target.value));}}
                    />
                </div>
                <div>
                    <span className="text-red-500">The selected semester does not have available scheduling information</span>
                </div>
            </div>);
    }

    function renderCalendar(): JSX.Element {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const headers = days.map(day => (
            <Card className="w-full h-full">
                <CardHeader title={day} className="text-center h-12 bg-zinc-800 text-white" />
                <CardContent className="h-full">
                    {/* TODO: Render courses for day */}
                </CardContent>
            </Card>
        ));

        return (
            <div className="flex mt-6">
                {/* TODO: Time reference column */}
                {headers}
            </div>
        );
    }

    return (<Layout>
        {/* Main body */}
        <div className="overfill-auto flex flex-grow h-full">
            {/* Resize card div to body */}
            <div className="w-full h-full ml-1 items-center justify-right">
                {/* Main calendar view */}
                <Card className="mt-4">
                    <CardHeader title="Semester Calendar" className="text-center h-10 bg-zinc-800 text-white" />
                    <CardContent>
                        {/* Semester selection */}
                        {renderSemesterSelection()}
                        {/* Calendar */}
                        {renderCalendar()}
                    </CardContent>
                </Card>
            </div>
        </div>
    </Layout>);
};
