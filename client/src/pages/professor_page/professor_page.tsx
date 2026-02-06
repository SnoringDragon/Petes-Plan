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
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox } from '@material-ui/core';
import RatingService from '../../services/RatingService';

export function Professor_Page() {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [error, setError] = useState('');

    const [professor, setProfessor] = useState<ApiProfessor | null>(null);
    const [boilergrades, setBoilergrades] = useState<Boilergrade[]>([]);

    const [makeReviews, setMakeReviews] = useState(false);
    const [takeAgain, setTakeAgain] = useState(false);

    const courseID = useRef({value:''});
    const courseSubject = useRef({value:''});
    const rating = useRef({value:''});
    const comment = useRef({value:''});
    const grade = useRef({value:''});
    const difficulty = useRef({value:''});
    const attendanceReq = useState(false);

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

    return (<Layout>
        <Dialog open={makeReviews} onClose={() => setMakeReviews(false)}>
            <DialogTitle>Make a Review</DialogTitle>    
            <DialogContent>
                <div className="flex">
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Course Subject ex. CS"
                        fullWidth
                        variant="standard"
                        className="mr-2"
                        inputRef={courseSubject}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Course ID ex. 18000"
                        fullWidth
                        variant="standard"
                        inputRef={courseID}
                    />
                </div>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Rating 1-5"
                    fullWidth
                    variant="standard"
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: 5, step: 0.25 } }}
                    inputRef={rating}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Difficulty 1-5"
                    fullWidth
                    variant="standard"
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: 5, step: 0.25 } }}
                    inputRef={difficulty}
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
                    inputRef={grade}
                />
                <Checkbox
                    onChange={() => setTakeAgain(!takeAgain)}
                    checked={takeAgain}
                />
                <text>Would you take a course with this professor again?</text>
                <p></p>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setMakeReviews(false)}>Close</Button>
                <Button onClick={() => {
                    RatingService.createReview({ instructor_id: professor._id,
                        in_courseSubject: courseSubject.current.value,
                        in_courseID: courseID.current.value,
                        rating: Number(rating.current.value),
                        comment: comment.current.value,
                        in_wouldTakeAgain: takeAgain,
                        difficulty: parseFloat(difficulty.current.value),
                        in_grade: grade.current.value })
                        .then(() => navigate(0))
                    setMakeReviews(false);
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

        <Button
            variant="outlined"
            size="large"
            color="secondary"
            className="w-full h-6 mt-2 mb-4"
            onClick={() => {
                setMakeReviews(true);
            }}>
            Do you want to leave a review? Click Here.
        </Button>

        <Ratings instructor={professor._id} filter={searchParams.get('filter')?.split(',') ?? []} />
        <div></div>
    </div></Layout>)
}
