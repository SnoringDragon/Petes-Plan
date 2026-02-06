import { Boilergrade } from '../../types/boilergrades';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel, InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select, Tooltip
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BoilerGradesService from '../../services/BoilerGradesService';
import { CourseLink } from '../course-link/course-link';
import ReactMarkdown from 'react-markdown';
import className = ReactMarkdown.propTypes.className;
import { Semester } from '../../types/semester';
import { ApiProfessor } from '../../types/professor';
import { ApiCourse } from '../../types/course-requirements';
import React from 'react';

const PANDEMIC_SEMESTERS = new Set(['202020', '202030', '202110', '202120']);
const PERCENTILES = [90, 75, 50, 25];

const calculatePercentile = (gpas: NonNullable<Boilergrade['gpa']>, percentile: number) => {
    let cumulativePercent = 0;

    for (let i = 0; i < gpas.length; ++i) {
        const [gpa, percent] = gpas[i];
        const prevGpa = gpas[i - 1]?.[0] ?? 0;
        cumulativePercent += percent;

        if (cumulativePercent >= percentile) {
            return (1 - (cumulativePercent - percentile) / percent) * (gpa - prevGpa) + prevGpa;
        }
    }

    return 4;
};

function GradeTable(props: { className?: string, grades: Boilergrade['grades'] }) {
    const filtered = props.grades.filter(([key, val]) => val > 0);

    return <div className={`grid grid-rows-2 justify-items-center gap-x-2 ${props.className ?? ''}`}
                style={{ gridTemplateColumns: `repeat(${filtered.length}, minmax(0, 1fr))` }}>
        {filtered.map(([key]) => <div key={key + '-head'}>{key}</div>)}
        {filtered.map(([key, val]) => <div key={key + '-cell'}
                                           className="border-t border-gray-500">{(val * 100).toFixed(2)}%</div>)}
    </div>;
}

export function Boilergrades(props: { className?: string } &
    ({ course: string } | { courseID: string, subject: string } | { email: string } | { instructor: string })) {

    const [boilergrades, setBoilergrades] = useState<Boilergrade[] | null>(null);
    const [type, setType] = useState<'course' | 'instructor'>('course');
    const [includePandemic, setIncludePandemic] = useState(true);
    const [includeHonors, setIncludeHonors] = useState(false);
    const [semesterFilter, setSemesterFilter] = useState<string[]>([]);
    const [showDetails, setShowDetails] = useState<string>('');

    useEffect(() => {
        setBoilergrades(null);
        const { className, ...args } = props;
        let promise: Promise<Boilergrade[]> | null = null;

        if ('course' in args || 'courseID' in args) {
            promise = BoilerGradesService.getCourse(args);
            setType('course');
        } else {
            promise = BoilerGradesService.getInstructor(args);
            setType('instructor');
        }

        promise.then(data => setBoilergrades(data));
    }, [(props as any).course, (props as any).courseID, (props as any).subject,
        (props as any).email, (props as any).instructor]);


    const [isHidden, setHidden] = useState(false);

    if (boilergrades === null || boilergrades.length === 0)
        return (<div className={props.className}>No boilergrades found</div>);

    const semesterMap: { [term: string]: Semester } = {};
    boilergrades.forEach(bg => semesterMap[bg.semester.term] = bg.semester);

    const semesters = Object.values(semesterMap)
        .filter(x => {
            if (includePandemic) return true;
            else if (PANDEMIC_SEMESTERS.has(x.term)) return false;
            return true;
        })
        .sort((a, b) => b.term.localeCompare(a.term));

    const filteredBoilergrades = boilergrades.filter(data => {
        if (!includePandemic && PANDEMIC_SEMESTERS.has(data.semester.term)) return false;
        if (semesterFilter.length && !semesterFilter.includes(data.semester.term)) return false;
        if (!includeHonors && data.section.name.toLowerCase().includes('honor')) return false;
        return true;
    });

    const instructorMap: { [id: string]: ApiProfessor } = {};
    const courseMap: { [id: string]: ApiCourse } = {};
    const boilergradesGroupsMap: { [id: string]: Pick<Boilergrade, 'gpa' | 'grades'> &
            { count: number, avg: number, percentiles: [number, number][], median: number } } = {};

    const appendGroup = (key: string, data: Boilergrade) => {
        if (!(key in boilergradesGroupsMap)) {
            boilergradesGroupsMap[key] = { gpa: data.gpa, grades: data.grades, count: 1, avg: 0, percentiles: [], median: 0 };
            return;
        }

        const obj = boilergradesGroupsMap[key];
        if (!obj.gpa) {
            obj.gpa = data.gpa;
        } else if (data.gpa !== null) {
            obj.gpa = obj.gpa.map(([gpa, percent], i) =>
                [gpa, percent + (data.gpa as any)[i][1]]);
        }

        obj.grades = obj.grades.map(([grade, percent], i) =>
            [grade, percent + data.grades[i][1]]);
        obj.count += 1;
    };

    let course = '';
    let instructor = '';

    filteredBoilergrades.forEach(data => {
        let key;
        if (type === 'course') {
            key = data.instructor._id;
            course = data.course as any as string;
            instructorMap[key] = data.instructor;
        } else {
            key = data.course._id;
            instructor = data.instructor as any as string;
            courseMap[key] = data.course;
        }

        appendGroup(key, data);
        appendGroup('all', data);
    });

    for (const key in boilergradesGroupsMap) {
        const obj = boilergradesGroupsMap[key];
        const gradesTotal = obj.grades.reduce((t, [, x]) => t + x, 0);
        obj.grades = obj.grades.map(([grade, num]) => [grade, num / gradesTotal]);

        if (obj.gpa) {
            const gpaTotal = obj.gpa.reduce((t, [, x]) => t + x, 0);
            obj.gpa = obj.gpa.map(([gpa, num]) => [gpa, num / gpaTotal]);

            obj.avg = obj.gpa.reduce((t, [gpa, percent]) => t + gpa * percent, 0);
            obj.median = calculatePercentile(obj.gpa, .5);

            obj.percentiles = PERCENTILES.map(val => [calculatePercentile(obj.gpa!, (100 - val) / 200),
                calculatePercentile(obj.gpa!, (100 + val) / 200)]);
        }
    }

    const boilergradesGroups = Object.entries(boilergradesGroupsMap)
        .sort(([a_key, a_val], [b_key, b_val]) => {
            if (a_key === b_key) return 0;
            if (a_key === 'all') return -1;
            if (b_key === 'all') return 1;
            return b_val.median - a_val.median;
        });

    return (<div className={`flex flex-col ${props.className ?? ''}`}>
        <div className="flex items-center mb-2">
            <a className="underline mr-4" target="_blank" href="https://boilergrades.com">Boilergrades:</a>
            <Button color="inherit" size="small" variant="outlined" onClick={() => setHidden(!isHidden)}>
                {isHidden ? 'Show' : 'Hide'}
            </Button>
        </div>
        <div className={`flex flex-col ${isHidden ? 'hidden' : ''}`}>
            <div className="flex mb-4">
                <FormControlLabel className="-mb-6" control={<Checkbox checked={includeHonors}
                                                     onChange={ev => setIncludeHonors(ev.target.checked)} />}
                                  label="Include Honors Sections" />
                <FormControlLabel className="-mb-6" control={<Checkbox checked={includePandemic}
                                                     onChange={ev => setIncludePandemic(ev.target.checked)} />}
                                  label="Include Pandemic Semesters" />
                <FormControl className="mt-2">
                    <InputLabel className="text-gray-400">Semester Filter</InputLabel>
                    <Select className="text-inherit w-80" multiple value={semesterFilter} onChange={ev => setSemesterFilter(ev.target.value as any)}
                             renderValue={arr => (arr as string[]).map(term => {

                                 const sem = semesters.find(s => s.term === term)!;

                                 if (!sem) return null;

                                 return `${sem.semester} ${sem.year}`;
                             }).filter(x => x).join(', ')} MenuProps={{ PaperProps: { className: 'max-h-80' } ,
                        getContentAnchorEl: () => (null as any), }}>
                        {semesters.map(sem => <MenuItem key={sem.term} value={sem.term}>
                            <Checkbox checked={semesterFilter.includes(sem.term)} />
                            <ListItemText>{sem.semester} {sem.year}</ListItemText>
                        </MenuItem>)}
                    </Select>
                </FormControl>
            </div>
            <div className="grid gap-3 p-2 items-center max-h-80 overflow-y-auto"
                 style={{ gridTemplateColumns: 'auto auto 1fr auto auto' }}
                 onScroll={() => { if (showDetails) setShowDetails('') }}>
                <div className="self-end underline text-lg">Instructors</div>
                <div className="self-end underline text-lg">Sections</div>
                {boilergradesGroupsMap.all.gpa ?
                <>
                    <div className="flex flex-col justify-end">
                        <div className="grid w-full" style={{ gridTemplateColumns: '.5fr 1fr 1fr 1fr .5fr' }}>
                            <div>0.0</div>
                            <div className="text-center">1.0</div>
                            <div className="text-center">2.0</div>
                            <div className="text-center">3.0</div>
                            <div className="text-right">4.0</div>
                        </div>
                        <div className="grid grid-cols-4 w-full">
                            <div className="border border-b-0 border-slate-200 h-2"></div>
                            <div className="border border-b-0 border-slate-200 h-2"></div>
                            <div className="border border-b-0 border-slate-200 h-2"></div>
                            <div className="border border-b-0 border-slate-200 h-2"></div>
                        </div>
                    </div>
                    <div className="self-end underline text-lg">GPA {'\u0394'}</div>
                    <div className="self-end underline text-lg">GPA</div>
                </> : <><div></div><div></div><div></div></>}


                {boilergradesGroups.map(([key, val]) => {
                    let name = null;
                    if (key === 'all') {
                        name = <div className="font-bold">All Sections</div>;
                    } else if (type === 'course') {
                        const instructor = instructorMap[key];
                        name = <div><Link to={`/professor?id=${key}`}>
                            {instructor.firstname}{instructor.nickname ? ` (${instructor.nickname}) ` : ' '}{instructor.lastname}
                        </Link></div>;
                    } else {
                        const course = courseMap[key];
                        name = <div><CourseLink useColor={false} courseID={course.courseID}
                                                subject={course.subject} filter={instructor} /></div>;
                    }

                    const hue = (Math.min(Math.max(val.avg - boilergradesGroupsMap.all.avg, -1), 1) + 1) / 2 * -180 + 360;

                    return (<React.Fragment key={key}>
                        {name}
                        <div>{val.count}</div>
                        {boilergradesGroupsMap.all.gpa ? <>
                            <Tooltip classes={{ tooltip: 'max-w-full' }} disableFocusListener disableTouchListener disableHoverListener
                                     open={showDetails === key} interactive title={<div>
                                <GradeTable grades={val.grades} className="text-base" />
                            </div>} arrow placement="top">
                                <div className="relative h-full" onClick={() => showDetails === key ? setShowDetails('') : setShowDetails(key)}>
                                    <div className="absolute inset-0 grid grid-cols-4">
                                        <div className="border-x border-gray-600 -my-1.5"></div>
                                        <div className="border-x border-gray-600 -my-1.5"></div>
                                        <div className="border-x border-gray-600 -my-1.5"></div>
                                        <div className="border-x border-gray-600 -my-1.5"></div>
                                    </div>

                                    {val.percentiles.map(([lower, upper], i) =>
                                        <Tooltip placement="top-start" arrow title={<div className="text-base">
                                            {PERCENTILES[i]}% of students earned a GPA in the range from {lower.toFixed(2)} to {upper.toFixed(2)}
                                            <span className="text-sm italic">&nbsp;(Click for details)</span>
                                        </div>} key={i}>
                                            <div className="absolute rounded-full cursor-pointer"
                                                 style={{ width: `${(upper - lower) / 4 * 100}%`,
                                                     top: '0',
                                                     bottom: '0',
                                                     left: `${lower / 4 * 100}%`,
                                                     backgroundColor: `hsla(${hue}, 100%, 75%, .2)` }}>

                                            </div>
                                        </Tooltip>)}
                                    <Tooltip placement="top" arrow title={<div className="text-base">
                                        The median for this section is {val.median.toFixed(2)}
                                    </div>}>
                                        <div className="absolute top-0 bottom-0 w-1 bg-stone-800"
                                             style={{ left: `calc(${val.median / 4 * 100}% - 0.125rem)` }}></div>
                                    </Tooltip>

                                    <Tooltip placement="top" arrow title={<div className="text-base">
                                        The mean for this section is {val.avg.toFixed(2)}
                                    </div>}>
                                        <div className="absolute w-3 flex top-0 bottom-0" style={{
                                            left: `calc(${val.avg / 4 * 100}% - 0.375rem)`
                                        }}>
                                            <div className="w-2 h-2 rounded-full bg-stone-900 m-auto"></div>
                                        </div>
                                    </Tooltip>
                                </div>
                            </Tooltip>
                            <div>{(val.avg - boilergradesGroupsMap.all.avg).toFixed(2)}</div>
                            <div>{val.avg.toFixed(2)}</div>
                        </> : <>
                            <div style={{ gridColumn: '3/6' }} className="flex justify-center">
                                <GradeTable grades={val.grades} className="w-fit" />
                            </div>
                        </>}

                    </React.Fragment>);
                })}
            </div>
        </div>
    </div>)
}
