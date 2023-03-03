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
    major: string
    type: string
    requirements: string
    concentration: string
};

const initialState: State = {
    major: "Computer Science",
    type: " Major",
    requirements: "",
    concentration: ""
}

export function Major_Requirements() {
    return (<div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title={initialState.major} className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <text><u>Requierements:</u> {initialState.requirements}</text>
                    <p></p>
                    <text><u><br />Concentration:</u></text>
                    <p></p>
                    <text>{initialState.concentration} </text>
                </div>
            </CardContent>
        </Card>
    </div>)
}