import { Card, CardContent, CardHeader, MenuItem, Select, TextField } from "@material-ui/core";
import { Layout } from "../../components/layout/layout";
import { useRef, useState } from "react";

export function SemesterCalendar() {
    // Semester Selection
    //TODO: Default to current semester
    const [selectedSem, setSem] = useState<string>('Fall');
    const [selectedYear, setYear] = useState<number>(2021);

    // Update Calendar to show selected semester
    const getCalendar = (sem: string, year: number) => {
        console.log(sem, year);
        //TODO: Vallidate semester and year exist in database
        //TODO: Get courses for semester and year
        //TODO: Display courses on calendar
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
                        {/* Align elements as a row */}
                        <div className="flex items-center">
                            {/* Select semester */}
                            <div className="ml-2 mr-6 mt-4">
                                <Select value={selectedSem} onChange={e => {
                                    setSem(e.target.value as string);
                                    getCalendar(selectedSem, selectedYear);
                                }}> 
                                    <MenuItem value="Fall">Fall</MenuItem>
                                    <MenuItem value="Winter">Winter</MenuItem>
                                    <MenuItem value="Spring">Spring</MenuItem>
                                    <MenuItem value="Summer">Summer</MenuItem>
                                </Select>
                            </div>
                            {/* Select year */}
                            <div className="mr-6">
                                <TextField
                                    id="year"
                                    style={{ width: 60 }}
                                    type="number"
                                    label="Year"
                                    value={selectedYear}
                                    onChange={e => {
                                        setYear(Number(e.target.value));
                                        getCalendar(selectedSem, selectedYear);
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </Layout>);
};