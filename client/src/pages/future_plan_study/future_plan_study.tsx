import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

export function Future_Plan_Study() {
    return (<div className="w-full h-full flex items-center justify-center">
        <Card className="-mt-16">
            <CardHeader title="Future Plan of Study" className="text-center bg-zinc-800 text-white" />
            <CardContent>
                <div className="p-4">
                    <text><u>Credit Hours:</u> 4.00</text>
                    <p></p>
                    <text><u><br />Course Description:</u></text>
                    <p></p>
                    <text>Problem solving and algorithms, implementation of algorithms in a high level programming
                        language, conditionals, the iterative approach and debugging, collections of data, searching
                        and sorting, solving problems by decomposition, the object-oriented approach, subclasses of
                        existing classes, handling exceptions that occur when the program is running, graphical user
                        interfaces (GUIs), data stored in files, abstract data types, a glimpse at topics from other
                        CS courses. Intended primarily for students majoring in computer sciences. Credit cannot be
                        obtained for both CS 18000 and any of 15600, 15800 and 15900. Not open to students with credit
                        in CS 24000. </text>
                    <p> </p>
                    <text><u><br />Class Type:</u></text>
                    <p></p>
                    <text>- Lecture
                        <br />- Recitation
                        <br />- Laboratory
                    </text>
                    <p></p>
                    <text><u><br />Semester(s) offered:</u></text>
                    <p></p>
                    <text><u><br />Restrictions:</u></text>
                    <p></p>
                    <text>Must be enrolled in one of the following Fields of Study (Major, Minor, or Concentration):
                        <br />&emsp;&emsp;- Computer Science
                        <br />&emsp;&emsp;- Computer Science Honors
                        <br />&emsp;&emsp;- Data Science
                        <br />&emsp;&emsp;- Data Science First Year
                        <br />&emsp;&emsp;- IM/Computer Science
                        <br />&emsp;&emsp;- Mathematics-Computer Science
                    </text>
                    <p></p>
                    <text><u><br />Prerequisities:</u></text>
                    <p></p>
                    <text>Undergraduate level MA 16100 Minimum Grade of C [may be taken concurrently] or Undergraduate
                        level MA 16300 Minimum Grade of C [may be taken concurrently] or Undergraduate level MA 16500
                        Minimum Grade of C [may be taken concurrently] or Undergraduate level MATH 16500 Minimum Grade
                        of C [may be taken concurrently] or Undergraduate level MA 16700 Minimum Grade of C [may be
                        taken concurrently] or (Undergraduate level MA 22100 Minimum Grade of C and (Undergraduate level
                        MA 22200 Minimum Grade of C or Undergraduate level MA 16021 Minimum Grade of C) ) or
                        (Undergraduate level MA 22300 Minimum Grade of C and Undergraduate level MA 22400 Minimum Grade
                        of C) or (Undergraduate level MA 16010 Minimum Grade of C and Undergraduate level MA 16020
                        Minimum Grade of C) </text>
                </div>
            </CardContent>
        </Card>
    </div>)
}