import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiProfessor } from '../../types/professor';
import { FaArrowLeft } from 'react-icons/fa';
import ProfessorService from '../../services/ProfessorService';
import { Link } from 'react-router-dom';
import { Ratings } from '../../components/ratings/ratings';
import { Boilergrades } from '../../components/boilergrades/boilergrades';
import { Boilergrade } from '../../types/boilergrades';
import BoilerGradesService from '../../services/BoilerGradesService';

export function Professor_Page() {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [error, setError] = useState('');

    const [professor, setProfessor] = useState<ApiProfessor | null>(null);
    const [boilergrades, setBoilergrades] = useState<Boilergrade[]>([]);

    const [viewReviews, setViewReviews] = useState(false);
    const [makeReviews, setMakeReviews] = useState(false);


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

                const first = res.firstname.replace(/([A-Z])$/g, '$1.');
                const last = res.lastname;

                BoilerGradesService.getInstructor({ first, last })
                    .then(res => setBoilergrades(res));
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

    const bgdata = BoilerGradesService.reduceBoilergrades(boilergrades, 'course');

    return (<Layout>
        <Dialog open={viewReviews} onClose={() => setViewReviews(false)}>
            <DialogTitle>Reviews</DialogTitle>    
            <DialogContent>
                <div>Reviews Go Here</div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setSem(false)}>Close</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={makeReviews} onClose={() => setMakeReviews(false)}>
            <DialogTitle>Make a Review</DialogTitle>    
            <DialogContent>
                <div>Making a review goes here</div>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Review"
                    fullWidth
                    variant="standard"
                    inputRef={}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setMakeReviews(false)}>Close</Button>
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

        <Boilergrades isCourseLinks={true} data={bgdata} className="w-full mb-4"  />

        <Ratings instructor={professor._id} filter={searchParams.get('filter')?.split(',') ?? []} />
        <div></div>
        <Button
            variant="contained"
            size="large"
            color="primary"
            className="w-full h-6"
            onClick={() => {
                setViewReviews(true);
            }}>
            Do you want to view the reviews? Click Here.
        </Button>
        <Button
            variant="contained"
            size="large"
            color="primary"
            className="w-full h-6"
            onClick={() => {
                setSem(true);
            }}>
            Do you want to make a reviews? Click Here.
        </Button>
    </div></Layout>)
}
