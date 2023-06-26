import { useCallback, useEffect, useRef, useState } from 'react';
import ScheduledTaskService from '../../services/ScheduledTaskService';
import { ScheduledTask } from '../../types/scheduled-task';
import { Button, CircularProgress, IconButton, Modal, TextField, Tooltip } from '@mui/material';
import { FaCheck, FaExclamationCircle, FaQuestion, FaTimes, FaForward, FaSave, FaInfoCircle } from 'react-icons/fa';
import Cron from 'react-js-cron';
import cronParser from 'cron-parser';

type Messages = {
    initial: ScheduledTask[],
    log: string,
    status: { status: ScheduledTask['status'], id: string }
};

type Payload<T extends keyof Messages> = {
    type: T,
    data: Messages[T]
};

const tryParse = (s: string | null | undefined) => {
    if (s === null || s === undefined) return null;
    try {
        return cronParser.parseExpression(s).next().toDate();
    } catch {
        return null;
    }
};

export function AdminTaskStatus() {
    const [tasks, setTasks] = useState<Messages['initial']>([]);
    const [log, setLog] = useState<string[]>([]);
    const [disabledButtons, setDisabledButtons] = useState<boolean[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [showLog, setShowLog] = useState(false);
    const [cronError, setCronError] = useState('');
    const [rescheduleTask, setRescheduledTask] = useState<ScheduledTask | null>(null);

    const timeRefs = useRef<({ value: string } | null)[]>([]);

    const yearRef = useRef({ value: '' });

    const handleInitial = useCallback((payload: Payload<'initial'>) => {
        setTasks(payload.data);
        setLog(payload.data.flatMap(x => x.log));
        setDisabledButtons([...new Array(payload.data.length)].map(() => false));
        setErrors([...new Array(payload.data.length)].map(() => ''));
    }, []);

    const handleLog = (payload: Payload<'log'>) => {
        setLog(log => [...log, payload.data]);
    };

    const handleStatus = (payload: Payload<'status'>) => {
        setTasks(tasks => tasks.map(task => {
            if (task._id !== payload.data.id) return task;
            task = {...task, status: payload.data.status};
            if (payload.data.status === 'running') task.lastRun = new Date().toString();
            return task;
        }));
    };

    // https://stackoverflow.com/a/55566585
    const handleEvent = useCallback((ev: MessageEvent<any>) => {
        const payload = JSON.parse(ev.data) as Payload<keyof Messages>;

        if (payload.type === 'initial')
            handleInitial(payload as Payload<'initial'>);
        else if (payload.type === 'status')
            handleStatus(payload as Payload<'status'>);
        else if (payload.type === 'log')
            handleLog(payload as Payload<'log'>);
    }, [])

    useEffect(() => {
        const source = ScheduledTaskService.getScheduledTasksEvent();
        source.addEventListener('message', handleEvent);

        return () => {
            source.close();
        };
    }, [handleEvent]);

    const getStatus = (status: ScheduledTask['status'], className='') => {
        if (status === 'running')
            return <CircularProgress className={className} color='inherit' size='1em' />;
        if (status === 'successful')
            return <FaCheck className={className} />;
        if (status === 'errored' || status === 'interrupted')
            return <FaExclamationCircle className={className + ' text-red-500'} />;
        if (status === 'unknown')
            return <FaQuestion className={className + ' text-gray-400'} />;
        if (status === 'aborted')
            return <FaTimes className={className + ' text-red-500'} />;
        if (status === 'deferred')
            return <FaForward className={className + ' text-gray-400'} />;
    };

    const setButtonDisabledState = (i: number, state: boolean) =>
        setDisabledButtons(disabledButtons.map((x, j) => i === j ? state : x));

    const setErrorState = (i: number, state: string) =>
        setErrors(errors.map((e, j) => i === j ? state : e));

    return (
        <div className="p-4 bg-opacity-25 bg-gray-500  rounded-md">
            <Modal open={rescheduleTask !== null} onClose={() => setRescheduledTask(null)}>
                <div className="w-full h-full flex" onClick={() => setRescheduledTask(null)}>
                    <div className="w-3/4 h-1/2 m-auto bg-gray-100 rounded-lg text-slate-900 z-50 flex flex-col p-4" onClick={ev => ev.stopPropagation()}>
                        <div className="text-lg mb-2">Set Schedule:</div>
                        <Cron className="ml-2" value={rescheduleTask?.scheduledAt ?? ''}
                              shortcuts defaultPeriod="day" mode="multiple"
                              humanizeLabels periodicityOnDoubleClick clockFormat="12-hour-clock"
                              onError={(ev: any) => setCronError(ev?.description ?? '')}
                              setValue={(val: string) => rescheduleTask && setRescheduledTask({
                            ...rescheduleTask,
                            scheduledAt: val
                        })} />
                        <div className="flex items-center text-sm italic ml-3">
                            <FaInfoCircle className="mr-2" />
                            Double click on a dropdown option to automatically select/deselect a periodicity
                        </div>
                        <div className="w-full my-2 font-bold relative text-center text-xl flex">
                            <div className="absolute top-0 left-0 right-0 h-1/2 border-b border-gray-200 z-0">

                            </div>
                            <div className="bg-gray-100 z-10 m-auto px-2">
                                OR
                            </div>
                        </div>
                        <div className="text-lg mb-2">Edit Cron Instruction Manually</div>
                        <TextField variant="outlined" color="secondary" size="small"
                                   value={rescheduleTask?.scheduledAt ?? ''}
                                   onChange={ev => rescheduleTask && setRescheduledTask({
                            ...rescheduleTask,
                            scheduledAt: ev.target.value
                        })}></TextField>
                        {cronError && <div className="mt-2 text-red-600">Error: {cronError}</div>}
                        {tryParse(rescheduleTask?.scheduledAt) && !cronError && <div className="mt-2">Next run time: {tryParse(rescheduleTask?.scheduledAt)?.toLocaleString(undefined, {
                            dateStyle: 'long',
                            timeStyle: 'long'
                        }) ?? ''}</div>}
                        <div className="mt-auto flex">
                            <Button className="mr-2 ml-auto" variant="outlined" color="secondary"
                                    onClick={() => setRescheduledTask(null)}>
                                Cancel
                            </Button>
                            <Button disabled={cronError !== ''} variant="contained" color="secondary" onClick={() => {
                                if (!rescheduleTask) return;
                                ScheduledTaskService.rescheduleTask({ id: rescheduleTask._id, time: rescheduleTask.scheduledAt })
                                    .then(() => {
                                        setTasks(tasks.map(t => t.name === rescheduleTask.name ? {
                                            ...t,
                                            scheduledAt: rescheduleTask.scheduledAt
                                        } : t));
                                        setRescheduledTask(null);
                                    })
                                    .catch(err => setCronError(err?.message ?? err));
                            }}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {showLog && <div className="fixed inset-0 bg-zinc-800 bg-opacity-50 w-full h-full z-50 flex items-center justify-center" onClick={() => setShowLog(false)}>
                <div className="w-3/4 h-5/6 bg-zinc-900 p-4 shadow-2xl rounded-lg relative">
                    <div className="h-full w-full text-sm overflow-auto flex flex-col-reverse relative" onClick={ev => ev.stopPropagation()}>
                        {[...log].reverse().map((line, i) => <pre key={`${i}--${line}`}>{line}</pre>)}
                    </div>
                    <FaTimes className="absolute top-5 right-12 w-6 h-6 text-red-500 cursor-pointer" onClick={() => setShowLog(false)} />
                </div>
            </div>}

            <div className="flex items-center mb-4">
                <span className="font-bold text-xl mr-auto">Task Status</span>
                <Button variant="outlined" size="small" color="inherit"
                        onClick={() => setShowLog(true)}>
                    Show Log
                </Button>
            </div>
            <div className="flex flex-col mt-2">
                {tasks.map((task, i) => (<div key={task._id} className="flex items-center py-2 px-4 mb-2 bg-gray-500 bg-opacity-25 rounded">
                    <Tooltip title={<span className="text-sm">Status: {task.status}</span>}>
                        <IconButton color="inherit" className="-m-2" disableRipple disableFocusRipple disableTouchRipple>
                            {getStatus(task.status, '-m-2 w-5 h-5')}
                        </IconButton>
                    </Tooltip>

                    <span className="mx-3">{task.name}</span>

                    <span className="mr-auto">Last run time: {
                        new Date(task.lastRun).toLocaleString()
                    }</span>

                    {errors[i] && <span className="text-red-500 text-sm font-bold mr-4">
                        Error: {errors[i]}
                    </span>}

                    <span className="mr-2">Next Run Time: {tryParse(task.scheduledAt)?.toLocaleString() ?? 'unknown'}</span>


                    <Button variant="outlined" size="small" color="inherit" className="mr-2" onClick={() => {
                        setRescheduledTask(task);
                    }}>
                        Reschedule
                    </Button>

                    {task.name === 'Update Course Catalog' &&
                        <TextField
                            variant="standard"
                            label="Number of Years to Fetch"
                            defaultValue={0}
                            color="secondary"
                            type="number"
                            size="small"
                            className="-my-1 mr-2"
                            inputRef={yearRef}
                            InputProps={{ className: 'text-slate-200' }}
                            InputLabelProps={{ className: 'text-slate-200' }}>
                    </TextField>}

                    <Button variant="outlined" size="small" color="inherit" disabled={disabledButtons[i]} onClick={() => {
                        setButtonDisabledState(i, true);
                        setErrorState(i, '');
                        const body = { id: task._id, force: true } as any;

                        if (task.name === 'Update Course Catalog') {
                            const val = +yearRef.current.value;
                            if (val > 0)
                                body.args = { numYears: val };
                        }

                        ScheduledTaskService.runTask(body)
                            .catch(err => setErrorState(i, err?.message ?? err))
                            .finally(() => setButtonDisabledState(i, false));
                    }}>
                        Force Run
                    </Button>
                    <div className="p-1"></div>
                    <Button variant="outlined" size="small" disabled={disabledButtons[i]} color="inherit" onClick={() => {
                        setButtonDisabledState(i, true);
                        setErrorState(i, '');

                        const body = { id: task._id } as any;

                        if (task.name === 'Update Course Catalog') {
                            const val = +yearRef.current.value;
                            if (val > 0)
                                body.args = { numYears: val };
                        }

                        (task.status === 'running' ? ScheduledTaskService.abortTask({ id: task._id }) :
                            ScheduledTaskService.runTask(body))
                            .catch(err => setErrorState(i, err?.message ?? err))
                            .finally(() => setButtonDisabledState(i, false));
                    }}>
                        {task.status === 'running' ? 'Abort' : 'Run'}
                    </Button>
                    <div className="p-1"></div>
                </div>))}
            </div>
        </div>
    );
}
