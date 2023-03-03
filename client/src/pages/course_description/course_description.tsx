import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { FormLabelTypeMap } from '@material-ui/core';

type State = {
    credit_hours: GLfloat
    course_title: string
    description: string
    class_type: string
    semester: string
    restrictions: string
    prerequisities: string
};

const initialState: State = {
    credit_hours: 4.00,
    course_title: "CS 18000 - Problem Solving And Object-Oriented Programming",
    description: "Problem solving and algorithms, implementation of algorithms in a high level programming language, conditionals, the iterative approach and debugging, collections of data, searching and sorting, solving problems by decomposition, the object-oriented approach, subclasses of existing classes, handling exceptions that occur when the program is running, graphical user interfaces (GUIs), data stored in files, abstract data types, a glimpse at topics from other CS courses. Intended primarily for students majoring in computer sciences. Credit cannot be obtained for both CS 18000 and any of 15600, 15800 and 15900. Not open to students with credit in CS 24000.",
    class_type: "- Lecture \n - Recitation \n- Laboratory",
    semester: "",
    restrictions: "Must be enrolled in one of the following Fields of Study (Major, Minor, or Concentration) \n- Computer Science \n- Computer Science Honors \n- Data Science \n- Data Science First Year \n- IM/Computer Science \n- Mathematics-Computer Science",
    prerequisities: "Undergraduate level MA 16100 Minimum Grade of C [may be taken concurrently] or Undergraduate level MA 16300 Minimum Grade of C [may be taken concurrently] or Undergraduate level MA 16500 Minimum Grade of C [may be taken concurrently] or Undergraduate level MATH 16500 Minimum Grade of C [may be taken concurrently] or Undergraduate level MA 16700 Minimum Grade of C [may be taken concurrently] or (Undergraduate level MA 22100 Minimum Grade of C and (Undergraduate level MA 22200 Minimum Grade of C or Undergraduate level MA 16021 Minimum Grade of C) ) or (Undergraduate level MA 22300 Minimum Grade of C and Undergraduate level MA 22400 Minimum Grade of C) or (Undergraduate level MA 16010 Minimum Grade of C and Undergraduate level MA 16020 Minimum Grade of C) ",
};

export function Course_Description() {
    return (<div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title={initialState.course_title} className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <text><u>Credit Hours:</u> {initialState.credit_hours}</text>
                    <p></p>
                    <text><u><br />Course Description:</u></text>
                    <p></p>
                    <text>{initialState.description} </text>
                    <p> </p>
                    <text><u><br />Class Type:</u></text>
                    <p></p>
                    <text>{initialState.class_type.split('\n').map(str => <p>{str}</p>)}</text>
                    <p></p>
                    <text><u><br />Semester(s) offered:</u></text>
                    <p></p>
                    <text>{initialState.semester.split('\n').map(str => <p>{str}</p>)} </text>
                    <p></p>
                    <text><u><br />Restrictions:</u></text>
                    <p></p>
                    <text>{initialState.restrictions.split('\n').map(str => <p>{str}</p>)}</text>
                    <p></p>
                    <text><u><br />Prerequisities:</u></text>
                    <p></p>
                    <text>{initialState.prerequisities}</text>
                </div>
            </CardContent>
        </Card>
    </div>)
}