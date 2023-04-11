import React, { useReducer, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { Accordion, AccordionDetails, AccordionSummary, FormLabelTypeMap, Modal } from '@material-ui/core';
import { Layout } from '../../components/layout/layout';
import { Degree, DegreeRequirement } from '../../types/degree';
import DegreeService from '../../services/DegreeService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserCourse } from '../../types/user-course';
import CourseHistoryService from '../../services/CourseHistoryService';
import DegreePlanService from '../../services/DegreePlanService';
import { DegreePlan } from '../../types/degree-plan';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select
} from '@material-ui/core';
import { ApiCourse } from '../../types/course-requirements';
import GPAService from '../../services/GPAService';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import styles from './major_requirement.module.scss';

function DegreeRequirements(props: { requirements: DegreeRequirement[], depth: number }) : JSX.Element | null {
    if (!props.requirements) return null;

    if (props.depth < 2) {
        return (<div>
            {props.requirements.map((req, i) => {
                if (req.type === 'group') {
                    let description = null;

                    if (req.description) {
                        if (req.description.length > 250)
                            description = <Accordion className="bg-neutral-800 bg-opacity-10 text-white">
                                <AccordionSummary>Show Details</AccordionSummary>
                                <AccordionDetails>
                                    <ReactMarkdown
                                        className={styles['group-description'] + ' -m-4 -mt-6'}>{req.description}</ReactMarkdown>
                                </AccordionDetails>
                            </Accordion>;
                        else if (/[A-Z]/.test(req.description))
                            description = <ReactMarkdown
                                className={styles['group-description'] + ' border-b border-gray-500 mb-3'}>{req.description}</ReactMarkdown>;
                    }

                    return (<div className="mb-3 bg-gray-600 bg-opacity-25 p-4 rounded-md" key={i}>
                            <div>
                                {req.text && <div className="flex">
                                    <ReactMarkdown className="text-xl mb-2">{req.text}</ReactMarkdown>
                                    {req.credits > 0 && <span className="text-xl ml-2">({req.credits} Credits)</span>}
                                </div>}
                                {description}
                                <DegreeRequirements requirements={req.groups} depth={props.depth + 1}/>
                            </div>
                        </div>
                    );
                }

                return <DegreeRequirements requirements={[req]} depth={props.depth + 1} />
            })}
        </div>);
    }


    return <div>
        {props.requirements.map((req, i) => {
            if (req.type === 'course')
                return (<div key={i} className="px-2 py-1">{req.subject} {req.courseID}</div>);
            if (req.type === 'or')
                return (<div key={i} className="px-2 py-1">{req.groups.map((c, j) => {
                    let contents = null;
                    if (c.type === 'course')
                        contents = <span>{c.subject} {c.courseID}</span>;
                    else if (c.type === 'course_range')
                        contents = <span>{c.subject} {c.courseStart}-{c.courseEnd}</span>;
                    else
                        contents = <ReactMarkdown>{c.text}</ReactMarkdown>;

                    return <span key={j}>
                    {j !== 0 && <span className="font-bold"> OR </span>}{contents}
                </span>;
                })}</div>);
            if (req.type === 'non_course')
                return (<ReactMarkdown key={i} className="px-2 py-1">{req.text}</ReactMarkdown>);
            return (<div key={i}>
                <DegreeRequirements requirements={req.groups} depth={props.depth + 1} />
            </div>)
        })}
    </div>;
}

export function Major_Requirements() {
    const [degree, setDegree] = useState<Degree | null>(null);
    const [searchParams] = useSearchParams();
    const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
    const [shared, setShared] = useState<{courseID: string, subject: string}[] | null>(null);
    
    const [degreePlans, setDegreePlans] = useState<DegreePlan[]>([]);
    const [degreePlan, setDegreePlan] = useState<DegreePlan | null>(null);

    const [gpa, setGpa] = useState<number | null>(null);
    const [majorGpa, setMajorGpa] = useState<number | null>(null);
    const navigate = useNavigate();

    const share = () => {
        DegreePlanService.getOverlap(degreePlan!._id, degree!._id).then(res => {console.log(res); setShared(res.reqs)});
        console.log(shared);
    }


    useEffect(() => {
        DegreeService.getDegree(searchParams.get('id') ?? '')
            .then(res => setDegree(res));
        CourseHistoryService.getCourses().then(res => setUserCourses(res.courses));
        DegreePlanService.getPlans().then(res => {
            setDegreePlans(res.degreePlans);
            if (res.degreePlans.length)
                setDegreePlan(res.degreePlans[0]);
        });
        GPAService.getCumulativeGPA().then(res => setGpa(res));
        GPAService.getMajorGPA({ major: searchParams.get('id') ?? '' }).then(res => setMajorGpa(res))
    }, [searchParams]);


    if (!degree) return (<span>'Degree not found'</span>);

    const mapCourse = (course: { courseID: string, subject: string }, i: number) => {
        const isSatisfied = userCourses.find(other => other.courseID === course.courseID &&
            other.subject === course.subject);

        let current = false;
        let planned = false;

        if (!isSatisfied) {
            let yr = new Date().getFullYear();
            let mon = new Date().getMonth();
            let month;

            if (mon > 7 && mon < 13) {
                month = "Fall";
            } else if (mon < 5 && mon > 0) {
                month = "Spring";
            } else if (mon > 4 && mon < 8) {
                month = "Summer";
            } else {
                month = "N/A";
            }

            for (const plan of degreePlans) {
                for (const c of plan.courses) {
                    if (c.courseID === course.courseID
                        && c.subject === course.subject) {
                        planned = true;

                        if (c.semester === month && yr === c.year) {
                            current = true;
                            break;
                        }
                    }
                }
            }
        }

        if (!degreePlan) return;

        let color = '';
        if (current) {
            color = 'bg-blue-500';
        } else if (planned) {
            color = 'bg-yellow-500';
        } else if (isSatisfied != null) {
            color = 'bg-green-500';
        } else {
            color = 'bg-red-500';
        }

        return (<span key={i}>
            {i !== 0 && <b> AND </b>}
            <Link className={`bg-opacity-25 ${color}`}
                  to={`/course_description?subject=${course.subject}&courseID=${course.courseID}`}>
                {course.subject} {course.courseID}
            </Link>
        </span>)
    }

    return (<Layout>
        <Modal open={shared !== null} onClose={() => setShared(null)}>
            <div className="flex w-full h-full" onClick={() => setShared(null)}>
                <Card className="m-auto w-1/2" onClick={ev => ev.stopPropagation()}>
                    <CardHeader title={"Comparison to Current Plan"} className="text-center bg-zinc-500 text-white" />
                    <CardContent>
                        <div className="p-4">
                            <u>Shared Requirements: </u> {shared?.length ? shared?.map(mapCourse) : ' None'}
                            <p></p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Modal>
        <header className="text-center text-white text-3xl mt-4 w-full relative">
            <div className="float-left ml-2 text-2xl cursor-pointer" onClick={() => navigate(-1)}>
                <FaArrowLeft />
            </div>
            {degree.name}
            {degreePlans.length > 0 && <div className="absolute right-0 top-0 text-white">
                <Select className="text-white my-2 italic mr-2" value={degreePlans.findIndex(p => p.name === degreePlan?.name)}
                         onChange={ev => {
                             setDegreePlan(degreePlans[ev.target.value as number]);
                             setShared(null);
                         }}>
                    {degreePlans.map((plan, i) => (<MenuItem key={i} value={i}>
                        {plan.name}
                    </MenuItem>))}
                </Select>
                <Button onClick={share} className="text-white">
                    See Shared Courses
                </Button>
            </div>}
        </header>
        <div className="w-full text-center mt-4">
            {majorGpa !== null && degree.type === 'major' && <span className="mr-8">Major GPA: {majorGpa.toFixed(2)}</span>}

            {gpa !== null && <span>Cumulative GPA: {gpa.toFixed(2)}</span>}
        </div>
        {degree.info && <div className="my-6">
            <Accordion className="bg-zinc-800 text-white">
                <AccordionSummary expandIcon={<FaChevronDown className="text-white" />}>
                    <span className="text-xl">About this program</span>
                </AccordionSummary>
                <AccordionDetails className="flex flex-col gap-1.5">
                    <ReactMarkdown>{degree.info}</ReactMarkdown>
                </AccordionDetails>
            </Accordion>
        </div>}
        {degree.concentrations.length > 0 && <>
            <span className="text-2xl">Concentrations</span>
            <div className="my-3 flex gap-5">
                {degree.concentrations.map((c, i) => <Link to={`/major_requirements?id=${c._id}`} key={i}>
                    {c.name}
                </Link>)}
            </div>
        </>}
        <span className="text-2xl">Requirements</span>
        <div className="mt-3">
            <DegreeRequirements requirements={degree.requirements} depth={0} />
        </div>
    </Layout>);
}
