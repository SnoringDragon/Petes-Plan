import React, { useEffect, useState } from 'react';
import { ApiAPTest, ApiUserAPTest } from '../../types/ap-test';
import ApService from '../../services/ApService';
import { Layout } from '../../components/layout/layout';
import { Accordion, AccordionDetails, AccordionSummary, Button, TextField } from '@material-ui/core';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';


export function AP_Class() {
    const [apTests, setApTests] = useState<ApiAPTest[]>([]);
    const [userApTests, setUserApTests] = useState<ApiUserAPTest[]>([]);

    const [modified, setModified] = useState<string[]>([]);

    const [search, setSearch] = useState('');

    useEffect(() => {
        Promise.all([ApService.getApTests(), ApService.getUserApTests()])
            .then(data => {
                setApTests(data[0]);
                setUserApTests(data[1]);
            })
    }, []);

    const setSelected = (apTest: ApiAPTest, score: 1 | 2 | 3 | 4 | 5) => {
        // remove this test with different scores
        const newTests = userApTests.filter(test => !(test.test._id === apTest._id && test.score !== score));
        setUserApTests([...newTests, {
            test: apTest,
            score
        }]);
        setModified([...modified, apTest._id]);
    };

    const saveTest = (test: ApiAPTest) => {
        ApService.modifyUserApTests(userApTests.map(test => ({
            test: test.test._id,
            score: test.score
        })))
            .then(() => {
                setModified(modified.filter(id => id !== test._id));
            });
    };

    return (<Layout><div className="w-full flex flex-col items-center justify-center">
        <TextField className="w-1/2" label="Search" variant="outlined" onChange={ev => setSearch(ev.target.value)} value={search}
                   InputProps={{className: 'text-white mb-5'}} inputProps={{style: {color:'white'}}}/>
        {apTests.filter(test => test.name.toLowerCase().includes(search.toLowerCase()))
            .map((test, i) => (<Accordion key={i} className="w-1/2 mb-2">
            <AccordionSummary expandIcon={<FaChevronDown className="text-sm" />}>
                AP {test.name}
            </AccordionSummary>
            <AccordionDetails className="flex flex-col items-center">
                <div className="flex border-y border-gray-300 mb-4">
                    <div className="flex flex-col border-x border-gray-300">
                        <div className="border-b border-gray-300 p-2">Score</div>
                        <div className="p-2">Equivalent Course</div>
                    </div>
                    {test.credits.map((credit, i) => {
                        const isSelected = userApTests.find(other => other.score === credit.score &&
                            other.test._id === test._id);

                        return (<div className={`flex flex-col border-r border-gray-300 cursor-pointer transition ${isSelected ? 'bg-slate-200' : ''}`} key={i}
                                     onClick={() => setSelected(test, credit.score)}>
                            <div className="border-b border-gray-300 p-2 text-center">{credit.score}</div>
                            <div className="p-2 px-6">
                                {credit.courses.map((course, i) => (<>{i !== 0 && '&'} <Link
                                    to={`/course_description?subject=${course.subject}&courseID=${course.courseID}`}>
                                    {course.subject} {course.courseID}
                                </Link> </>))}
                            </div>
                        </div>);
                    })}
                </div>
                {
                    modified.find(id => test._id === id) ?
                        <Button className="w-1/2" color="secondary" variant="contained" onClick={() => saveTest(test)}>
                            Save
                        </Button> : null
                }
            </AccordionDetails>
        </Accordion>))}
    </div></Layout>)
}