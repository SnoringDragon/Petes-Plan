import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

type State = {
    score3: string
    score4: string
    score5: string
};

const initialState: State = {
    score3: "SPAN 10100 & 10200",
    score4: "SPAN 10100, 10200 & 20100",
    score5: "SPAN 10100, 10200, 20100 & 20200"
};
export function AP_Class() {
    return (<div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title="AP Spanish Language" className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <text><u>Score: 3</u></text>
                    <p></p>
                    <text>{initialState.score3}</text>
                    <p> </p>
                    <text><u>Score: 4</u></text>
                    <p></p>
                    <text>{initialState.score4}</text>
                    <p> </p>
                    <text><u>Score: 5</u></text>
                    <p></p>
                    <text>{initialState.score5}</text>
                </div>
            </CardContent>
        </Card>
    </div>)
}