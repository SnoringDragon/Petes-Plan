import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '../../components/layout/layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiProfessor } from '../../types/professor';
import { FaArrowLeft } from 'react-icons/fa';
import ProfessorService from '../../services/ProfessorService';
import { Ratings } from '../../components/ratings/ratings';
import { Boilergrades } from '../../components/boilergrades/boilergrades';
import { Boilergrade } from '../../types/boilergrades';
import BoilerGradesService from '../../services/BoilerGradesService';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';

export function Professor_Page() {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [error, setError] = useState('');

    const [professor, setProfessor] = useState<ApiProfessor | null>(null);
    const [boilergrades, setBoilergrades] = useState<Boilergrade[]>([]);

    const [makeReviews, setMakeReviews] = useState(false);

    const course = useRef({value:''});
    const rating = useRef({value:''});
    const comment = useRef({value:''});
    const grade = useRef({value:''});
    const difficulty = useRef({value:''});
    const attendanceReq = useRef({value:''});

    const [addReviews, setAddReviews] = useState<{
        add: { email: string,
            dateSubmitted: string,
            professor: string,
            course: string,
            attendanceReq: boolean,
            rating: number,
            comment: string,
            grade: string}[]
    }>({ add: []});

    useEffect(() => {
        const id = searchParams.get('id') ?? '';

        ProfessorService.getProfessor({ id })
            .then((res: ApiProfessor | null) => {
                if (!res) {
                    setProfessor(null);
                    setError('Professor not found');
                    return;
                }
                setProfessor(res);
            })
            .catch(err => {
                setError(err?.message ?? err);
            });


    }, [searchParams])

    if (!professor) return (<Layout><div className="text-2xl flex flex-col h-full justify-center items-center">
        Loading...
        {error && <>
            <div className="text-xl text-red-500 mt-4">Error: {error}</div>
            <a className="text-sm mt-2 cursor-pointer" onClick={() => navigate(-1)}>Go back</a>
        </>}
    </div></Layout>)

    const save = () => {
        const promises = [];

        if (addReviews.add.length)
            promises.push(ProfessorService.addReview(addReviews.add);

        Promise.all(promises)
            .then(res => {
                setAddReviews({ add: [] });
            })
            .catch(err => {
                setError(err?.message ?? err);
            })
    };

    return (<Layout>
        <Dialog open={makeReviews} onClose={() => setMakeReviews(false)}>
            <DialogTitle>Make a Review</DialogTitle>    
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Course"
                    fullWidth
                    variant="standard"
                    inputRef={course}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Rating"
                    fullWidth
                    variant="standard"
                    inputRef={rating}
                />
                <TextField multiline={true}
                    autoFocus
                    margin="dense"
                    label="Comment"
                    fullWidth
                    variant="standard"
                    inputRef={comment}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Grade"
                    fullWidth
                    variant="standard"
                    innerRef={grade}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setMakeReviews(false)}>Close</Button>
                <Button onClick={() => {
                    const modifications = {...courseModifications};
                    modifications.add = [...modifications.add, {
                        professor_id: string,
                        course: course,
                        attendanceReq: boolean,
                        rating: rating,
                        comment: comment,
                        grade: grade,
                        difficulty: difficulty
                    }];
                    setCourseModifications(modifications);
                    setSem(false);
                }}>Add</Button>
            </DialogActions>
        </Dialog>
        <div className="w-full h-full flex flex-col items-center">
        <header className="text-center text-white text-3xl mt-4 w-full">
            <div className="float-left ml-2 text-2xl cursor-pointer" onClick={() => navigate(-1)}>
                <FaArrowLeft />
            </div>
        </header>
        <div className="flex flex-col">
            <span className="text-2xl">{professor.firstname}{professor.nickname ? ` (${professor.nickname}) ` : ' '}{professor.lastname}</span>

        </div>

        <div className="flex mt-4 mb-8">
            <div className="flex">
                <span className="underline font-bold">Email: </span> &nbsp;
                <a href={`mailto:` + professor.email}>{professor.email}</a>
            </div>
            {professor.rateMyProfIds.length ? <div className="flex ml-8">
                <span className="mr-2">Rate My Professor Links:</span>
                {professor.rateMyProfIds.map(
                    (rateMyProfIds, i) => <div key={rateMyProfIds} className="ml-2">
                        <a href={`https://www.ratemyprofessors.com/professor/${rateMyProfIds}`} target="_blank">
                        Link {i + 1}
                    </a></div>)}
            </div> : null}
        </div>

        <Boilergrades instructor={professor._id} className="w-full mb-4"  />

        <Ratings instructor={professor._id} filter={searchParams.get('filter')?.split(',') ?? []} />
        <div></div>
        <Button
            variant="contained"
            size="large"
            color="primary"
            className="w-full h-6"
            onClick={() => {
                setMakeReviews(true);
            }}>
            Do you want to leave a review? Click Here.
        </Button>
    </div></Layout>)
}
