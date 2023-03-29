import { RatingSearch, RatingSearchResult } from '../../types/rating';
import { useEffect, useState } from 'react';
import RatingService from '../../services/RatingService';
import { Box, Chip, MenuItem, OutlinedInput, Select } from '@material-ui/core';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function RatingSquare(props: {
    rating: number,
    invert?: boolean,
    label: string,
    scalingFunc?: (rating: number) => number
}) {
    let relativeRating = ((props.invert ? 6 - props.rating : props.rating) - 1) / 4;
    if (props.scalingFunc) relativeRating = props.scalingFunc(relativeRating)

    return (<div className="flex flex-col items-center mb-4">
        <span className="text-sm font-bold mb-1">{props.label}</span>
        <div className="p-4 relative flex items-center justify-center overflow-hidden w-16 h-16">
            <span className="z-10 relative font-bold text-3xl">{props.rating.toFixed(1)}</span>
            <div className="absolute top-0 bottom-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style={{
                width: 'calc(1000vw + 100%)',
                left: `${-1000 * relativeRating}vw`
            }}>
            </div>
        </div>
    </div>);
}

function BarChart(props: {
    title: string,
    data: [number, number, number, number, number],
    className?: string
}) {
    const max = Math.max(...props.data);

    return (<div className={`${props.className ?? ''} bg-gray-500 bg-opacity-25 p-3 flex flex-col rounded`}>
        <span className="text-lg mb-2">{props.title}</span>
        <div className="flex flex-col">
            {props.data.map((num, i) => (<div key={i} className="flex mb-2 items-center">
                <span className="font-bold text-sm">{i + 1}</span>
                <div className="flex-grow flex items-start h-8 bg-gray-500 bg-opacity-25 mx-2">
                    <div style={{ width: `${(num / max) * 100}%` }} className="bg-blue-500 h-full"></div>
                </div>
                <span className="font-bold w-6">{num}</span>
            </div>)).reverse()}
        </div>
    </div>)
}

export function Ratings(props: RatingSearch & { filter?: string[] }) {
    const { filter: defaultFilter, ...search } = props;

    const [ratings, setRatings] = useState<RatingSearchResult | null>(null);
    const [filter, setFilter] = useState<string[]>([...(defaultFilter ?? [])]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const isCourse = 'course' in props || 'courseID' in props;

    useEffect(() => {
        setLoading(true);
        RatingService.getRatings(search)
            .then(res => setRatings(res))
            .catch(err => setError(err?.message ?? err))
            .finally(() => setLoading(false));
    }, [(props as any).course, (props as any).courseID, (props as any).subject,
        (props as any).instructor, (props as any).email]);

    if (loading || !ratings) return (<span>Loading</span>);
    if (!ratings.data.length) return (<span>No ratings found.</span>);

    const name = isCourse ?
        `${ratings.metadata.courses[0].subject} ${ratings.metadata.courses[0].courseID}` :
        `${ratings.metadata.instructors[0].firstname} ${ratings.metadata.instructors[0].lastname}`;

    let { avgQuality, avgDifficulty, count, wouldTakeAgain, numQuality, numDifficulty, tags } = ratings.metadata;
    let data = ratings.data;

    if (filter.length) {
        data = ratings.data.filter(rating => {
            return filter.includes(isCourse ? rating.instructor._id : rating.course._id);
        });
        avgQuality = data.reduce((t, x) => t + x.quality, 0) / data.length;
        avgDifficulty = data.reduce((t, x) => t + x.difficulty, 0) / data.length;
        count = data.length;
        wouldTakeAgain = data.filter(x => x.wouldTakeAgain === true).length / data.filter(x => x.wouldTakeAgain !== null).length;
        if (Number.isNaN(wouldTakeAgain)) wouldTakeAgain = null;
        numQuality = [...new Array(5)].map((_, i) => {
            return data.filter(x => Math.round(x.quality) === i + 1).length;
        }) as [number, number, number, number, number];
        numDifficulty = [...new Array(5)].map((_, i) => {
            return data.filter(x => Math.round(x.difficulty) === i + 1).length;
        }) as [number, number, number, number, number];
        tags = Object.entries(data.reduce((map, rating) => {
            rating.tags.forEach(name => {
                map[name] = (map[name] ?? 0) + 1;
            })

            return map;
        }, {} as { [key: string]: number }))
            .map(([name, count]) => ({ name, count }));
    }

    const totalTagCount = tags.reduce((t, x) => t + x.count, 0);
    let tagCount = totalTagCount * .66; // number of tags to include, 66th percentile
    const includedTags = tags.filter(tag => {
        const include = tagCount > 0;
        tagCount -= tag.count;
        return include;
    });

    return (<div className="flex flex-col">
        <div className="flex mb-2">
            <div className="flex flex-col mr-2">
                <div className="flex items-start mb-1">
                    <span className="text-6xl font-bold">{avgQuality.toFixed(1)}</span>
                    <span className="mt-1.5">/ 5</span>
                </div>
                <span className="mb-2">Overall quality based on {count} ratings</span>
                <span className="text-4xl font-bold mb-4">{name}</span>
                <div className="flex flex-grow mb-1">
                    <div className="flex flex-col items-center p-4 border-r border-gray-500">
                        <span className="text-3xl font-bold">{wouldTakeAgain === null ? 'N/A' :
                            (wouldTakeAgain * 100).toFixed(1) + '%'}</span>
                        <span>Would take again</span>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <span className="text-3xl font-bold">{avgDifficulty.toFixed(1)}</span>
                        <span>Level of difficulty</span>
                    </div>
                </div>
            </div>
            <BarChart title="Rating Distribution" data={numQuality} className="flex-grow mx-4" />
            <BarChart title="Difficulty Distribution" data={numDifficulty} className="flex-grow mx-4" />
        </div>
        <span className="font-bold mb-1">Tags for {name}</span>
        <div className="flex flex-wrap mb-2">
            {includedTags.map(tag => (<div key={tag.name}
                                   className="py-1.5 px-2 bg-opacity-25 bg-gray-500 rounded-full uppercase font-bold m-1">
                <div className="scale-x-90 transform">{tag.name}</div>
            </div>))}
        </div>
        <div className="flex items-center mb-6">
            <Select multiple
                    autoWidth
                    className="w-auto flex-grow"
                    displayEmpty
                    value={filter}
                    onChange={ev => setFilter(Array.isArray(ev.target.value) ? ev.target.value :
                        (ev.target.value as string).split(','))}
                    input={<OutlinedInput label={isCourse ? 'Instructors' : 'Courses'} />}
                    renderValue={(selected) => {
                        if ((selected as string[]).length === 0)
                            return (<em className="text-gray-400">{isCourse ? 'Select Instructor' : 'Select Course'}</em>);

                        return (<Box className="flex flex-wrap gap-2">
                            {(selected as string[]).map(id => {
                                let label = '';

                                if (isCourse) {
                                    const instructor = ratings.metadata.instructors.find(({_id}) => _id === id)!;
                                    label = `${instructor.firstname} ${instructor.lastname}`;
                                } else {
                                    const course = ratings.metadata.courses.find(({_id}) => _id === id)!;
                                    label = `${course.subject} ${course.courseID}`;
                                }

                                return (<Chip clickable={true} onMouseDown={ev => {
                                    if (ev.button === 0)
                                        setFilter(filter.filter(i => i !== id))
                                    ev.stopPropagation();
                                }} key={id} label={<div className="flex items-center">{label} <FaTimes /></div>} />);
                            })}
                        </Box>);
                    }}>
                <MenuItem disabled value="">
                    <em>{isCourse ? 'Select Instructor' : 'Select Course'}</em>
                </MenuItem>
                {isCourse ? ratings.metadata.instructors.map(instructor => (<MenuItem key={instructor._id} value={instructor._id}>
                    {instructor.firstname} {instructor.lastname}
                </MenuItem>)) :
                    ratings.metadata.courses.map(course => (<MenuItem key={course._id} value={course._id}>
                        {course.subject} {course.courseID}
                    </MenuItem>))}
            </Select>
            <FaTimes className="ml-4 text-xl cursor-pointer" onClick={() => setFilter([])} />
        </div>
        {data.map(rating => (<div key={rating._id} className="bg-gray-500 bg-opacity-25 p-6 mb-4 flex">
            <div className="mr-6">
                <RatingSquare rating={rating.quality} label="Quality" />
                <RatingSquare rating={rating.difficulty} label="Difficulty" invert={true} scalingFunc={x => x ** (.75)} />
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex items-center font-bold">
                    <Link className="text-lg" to={isCourse ? `/` :
                        `/course_description?subject=${rating.course.subject}&courseID=${rating.course.courseID}`}>{ // TODO: add instructor link
                        isCourse ? `${rating.instructor.firstname} ${rating.instructor.lastname}` :
                            `${rating.course.subject} ${rating.course.courseID}`
                    }</Link>
                    <span className="ml-auto">{
                        new Date(rating.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })
                    }</span>
                </div>
                <div className="text-lg">
                    {rating.review}
                </div>
            </div>
        </div>))}
    </div>);
}
