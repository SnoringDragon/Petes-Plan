import { Layout } from "../../components/layout/layout";
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, TextField } from '@material-ui/core';
import { CourseLink } from '../../components/course-link/course-link';
import { Grade } from '../../types/grades';
import GradesService from '../../services/GradesService';

export function GradeCalc() {
    const [grades, _setGrades] = useState<Grade[] | null>(null);

    const courseRef = useRef({ value: '' });

    const categoryAddRef = useRef<{ value: '' }[]>([]);
    const categoryWeightRef = useRef<{ value: '' }[]>([]);
    const categoryCappedRef = useRef<{checked: boolean}[]>([]);

    const assignmentAddRef = useRef<{ value: '' }[][]>([]);
    const assignmentAddNumeratorRef = useRef<{ value: '' }[][]>([]);
    const assignmentAddDenominatorRef = useRef<{ value: '' }[][]>([]);

    const assignmentNameRef = useRef<{ value: '' }[][][]>([]);
    const assignmentNumeratorRef = useRef<{ value: '' }[][][]>([]);
    const assignmentDenominatorRef = useRef<{ value: '' }[][][]>([]);

    const postGrades = useMemo(() => {
        let lastCallback: number | undefined = undefined;

        return (g: Grade[], n = 250) => {
            clearTimeout(lastCallback);
            if (!n)
                GradesService.setGrades(g)
            else
                lastCallback = setTimeout(() => {
                    GradesService.setGrades(g);
                }, n) as any;
        };
    }, []);

    const setGrades = (g: Grade[]) => {
        postGrades(g);
        return _setGrades(g);
    }

    useEffect(() => {
        GradesService.getGrades()
            .then(r => setGrades(r));
    }, []);

    const calculateCategoryGrade = (category: Grade['course']['grades'][number]) => {
        let numerator = 0;
        let denominator = 0;

        category.assignments.forEach(assignment => {
            numerator += assignment.numerator;
            denominator += assignment.denominator;
        });

        if (category.capped) numerator = Math.min(numerator, denominator);

        return denominator === 0 ? 0 : numerator / denominator;
    };

    const calculateGrade = (course: Grade) => {
        const values = course.course.grades.map(category => {
            return { value: calculateCategoryGrade(category),
                weight: category.weight}
        });

        const totalWeights = values.reduce((t, x) => t + x.weight, 0);

        return values.reduce((t, x) => t + x.value * x.weight / totalWeights, 0)
    }

    if (!grades) return <Layout></Layout>;


    return(<Layout>
        <div className="flex flex-col">
        {grades.map((course, i) =>
            <div key={i} className="p-4 flex flex-col bg-gray-500 rounded-md bg-opacity-25 mb-4 text-white">
                <div className="flex mb-4 items-center">
                    <CourseLink courseID={course.course.courseID} subject={course.course.subject} className="text-3xl" useColor={false} />

                    <span className="ml-4 font-bold text-xl">Grade: {(calculateGrade(course) * 100).toFixed(2)}%</span>

                    <Button variant="outlined" className="ml-auto" color="inherit" onClick={() => {
                        const g = [...grades];
                        g.splice(i, 1);
                        setGrades(g);
                    }}>Remove</Button>
                </div>


                {course.course.grades.map((cat, j) => <div className="p-4 flex flex-col bg-gray-500 rounded-md bg-opacity-25 mb-4 text-white" key={j}>
                    <div className="flex mb-3 items-center">
                        <TextField className="text-2xl" size={"small"} variant={"outlined"} InputProps={{ className: 'text-inherit' }}
                                   defaultValue={cat.category} onChange={ev => {
                                       const g = [...grades];
                                       g[i].course.grades[j].category = ev.target.value;
                                       setGrades(g)
                        }}></TextField>
                        <span className="mx-4">Weight:</span>
                        <TextField type="number" defaultValue={cat.weight} onChange={ev => {
                            const g = [...grades];
                            const weight = parseFloat(ev.target.value);
                            g[i].course.grades[j].weight = weight;
                            if (weight <= 0)
                                alert('Invalid value for weight')
                            else
                                setGrades(g);
                        }} InputProps={{ className: 'text-inherit' }}/>
                        <span className="mx-4">Is capped:</span>
                        <Checkbox defaultChecked={cat.capped} onChange={ev => {
                            const g = [...grades];
                            g[i].course.grades[j].capped = ev.target.checked;
                            setGrades(g)
                        }}></Checkbox>
                        <span className="ml-4 font-bold text-xl">Grade: {(calculateCategoryGrade(cat) * 100).toFixed(2)}%</span>
                        <Button variant="outlined" className="ml-auto" color="inherit" onClick={() => {
                            const g = [...grades];
                            grades[i].course.grades.splice(j, 1);
                            setGrades(g);
                        }}>Remove</Button>
                    </div>

                    {cat.assignments.map((assignment, k) => <div className="flex py-3 px-4 mb-2 bg-gray-500 rounded-md bg-opacity-25 items-center text-white">
                        <TextField inputRef={ref => {
                            if (!assignmentNameRef.current[i]) assignmentNameRef.current[i] = [];
                            if (!assignmentNameRef.current[i][j]) assignmentNameRef.current[i][j] = [];
                            assignmentNameRef.current[i][j][k] = ref;
                        }} className="text-lg" defaultValue={assignment.name} InputProps={{ className: 'text-inherit' }}></TextField>
                        <span className="mx-2">Earned Points:</span>
                        <TextField inputRef={ref => {
                            if (!assignmentNumeratorRef.current[i]) assignmentNumeratorRef.current[i] = [];
                            if (!assignmentNumeratorRef.current[i][j]) assignmentNumeratorRef.current[i][j] = [];
                            assignmentNumeratorRef.current[i][j][k] = ref;
                        }} type="number" defaultValue={assignment.numerator} InputProps={{ className: 'text-inherit' }}></TextField>
                        <span className="mx-2">Total Points:</span>
                        <TextField inputRef={ref => {
                            if (!assignmentDenominatorRef.current[i]) assignmentDenominatorRef.current[i] = [];
                            if (!assignmentDenominatorRef.current[i][j]) assignmentDenominatorRef.current[i][j] = [];
                            assignmentDenominatorRef.current[i][j][k] = ref;
                        }} type="number" defaultValue={assignment.denominator} InputProps={{ className: 'text-inherit' }}></TextField>

                        <Button variant="outlined" className="ml-auto" color="inherit" onClick={() => {
                            const name = assignmentNameRef.current[i][j][k].value;
                            const numerator = assignmentNumeratorRef.current[i][j][k].value;
                            const denominator = assignmentDenominatorRef.current[i][j][k].value;

                            const g = [...grades];
                            const assignment = grades[i].course.grades[j].assignments[k];
                            assignment.numerator = parseFloat(numerator);
                            assignment.denominator = parseFloat(denominator);

                            if (assignment.numerator < 0 || assignment.denominator < 0)
                                return alert('Invalid grade entered');

                            assignment.name = name;
                            setGrades(g);
                        }}>Update</Button>

                        <Button variant="outlined" className="ml-2" color="inherit" onClick={() => {
                            const g = [...grades];
                            grades[i].course.grades[j].assignments.splice(k, 1);
                            setGrades(g);
                        }}>Remove</Button>
                    </div>)}

                    <div className="flex py-3 px-4 bg-gray-500 rounded-md bg-opacity-25 items-center text-white">
                        <span className="text-xl mr-4">Add assignment:</span>
                        <TextField className="text-white mr-4" inputRef={ref => {
                            if (!assignmentAddRef.current[i]) assignmentAddRef.current[i] = [];
                            assignmentAddRef.current[i][j] = ref;
                        }} InputProps={{ className: 'text-inherit' }}></TextField>
                        <span className="mr-2">Points Earned:</span>
                        <TextField className="text-white mr-4" type="number" inputRef={ref => {
                            if (!assignmentAddNumeratorRef.current[i]) assignmentAddNumeratorRef.current[i] = [];
                            assignmentAddNumeratorRef.current[i][j] = ref;
                        }} InputProps={{ className: 'text-inherit' }}></TextField>
                        <span className="mr-2">Total Points:</span>
                        <TextField className="text-white mr-4" type="number" inputRef={ref => {
                            if (!assignmentAddDenominatorRef.current[i]) assignmentAddDenominatorRef.current[i] = [];
                            assignmentAddDenominatorRef.current[i][j] = ref;
                        }} InputProps={{ className: 'text-inherit' }}></TextField>
                        <Button variant="outlined" className="ml-auto" color="inherit" onClick={() => {
                            const name = assignmentAddRef.current[i][j].value;
                            const numerator = parseFloat(assignmentAddNumeratorRef.current[i][j].value);
                            const denominator = parseFloat(assignmentAddDenominatorRef.current[i][j].value);

                            if (numerator < 0 || denominator < 0)
                                return alert('Invalid grade entered')

                            const g = [...grades];
                            g[i].course.grades[j].assignments.push({ name, numerator, denominator });
                            setGrades(g);
                        }}>Add</Button>
                    </div>
                </div>)}

            <div className="flex py-3 px-4 bg-gray-500 rounded-md bg-opacity-25 items-center text-white">
                <span className="text-xl mr-4">Add category:</span>
                <TextField className="text-white mr-4" inputRef={ref => {
                    categoryAddRef.current[i] = ref;
                }} InputProps={{ className: 'text-inherit' }}></TextField>
                <span className="mr-2">Weight:</span>
                <TextField className="text-white mr-4" type="number" inputRef={ref => {
                    categoryWeightRef.current[i] = ref;
                }} InputProps={{ className: 'text-inherit' }}></TextField>
                <span>Capped:</span>
                <Checkbox inputRef={ref => categoryCappedRef.current[i] = ref as any}></Checkbox>
                <Button className="ml-auto" variant="outlined" color="inherit" onClick={() => {
                    const name = categoryAddRef.current[i].value;
                    const weight = parseFloat(categoryWeightRef.current[i].value)

                    if (weight <= 0 || Number.isNaN(weight)) return alert('Invalid weight entered')

                    const capped = categoryCappedRef.current[i].checked;
                    const g = [...grades];
                    g[i].course.grades.push({
                        category: name,
                        weight,
                        capped,
                        assignments: []
                    })
                    setGrades(g);
                }}>Add</Button>
            </div>
        </div>)}
        <div className="flex p-4 bg-gray-500 rounded-md bg-opacity-25 items-center text-white">
            <span className="text-xl mr-4">Add course:</span>
            <TextField className="text-white mr-4" inputRef={courseRef} InputProps={{ className: 'text-inherit' }}></TextField>
            <Button className="ml-auto" variant="outlined" color="inherit" onClick={() => {
                const [subject, courseID] = courseRef.current.value.trim().toUpperCase().split(' ');
                setGrades([...grades, {
                    course: {
                        subject,
                        courseID,
                        grades: []
                    }
                }])
            }}>Add</Button>
        </div>
        </div>
    </Layout>)
}
