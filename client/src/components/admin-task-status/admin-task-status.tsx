import { useCallback, useEffect, useRef, useState } from 'react';
import ScheduledTaskService from '../../services/ScheduledTaskService';
import { ScheduledTask } from '../../types/scheduled-task';
import { Button, CircularProgress, IconButton, TextField, Tooltip } from '@material-ui/core';
import { FaCheck, FaExclamationCircle, FaQuestion, FaTimes, FaForward, FaSave } from 'react-icons/fa';

type Messages = {
    initial: ScheduledTask[],
    log: string,
    status: { status: ScheduledTask['status'], id: string }
};

type Payload<T extends keyof Messages> = {
    type: T,
    data: Messages[T]
};

export function AdminTaskStatus() {
    const [tasks, setTasks] = useState<Messages['initial']>([]);
    const [log, setLog] = useState<string[]>([]);
    const [disabledButtons, setDisabledButtons] = useState<boolean[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const timeRefs = useRef<({ value: string } | null)[]>([]);
    const [modifiedTimes, setModifiedTimes] = useState<boolean[]>([]);

    const handleInitial = useCallback((payload: Payload<'initial'>) => {
        setTasks(payload.data);
        setLog(payload.data.flatMap(x => x.log));
        setDisabledButtons([...new Array(payload.data.length)].map(() => false));
        setModifiedTimes([...new Array(payload.data.length)].map(() => false));
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

    return (<div className="p-4 bg-opacity-25 bg-gray-500  rounded-md">
        <span className="font-bold text-xl">Task Status</span>
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

                <div className="mr-2 relative">
                    <TextField label="Scheduled Time" variant="outlined" size="small"
                               defaultValue={task.scheduledAt}
                               inputRef={el => timeRefs.current[i] = el}
                               onChange={() => setModifiedTimes(modifiedTimes
                                   .map((val, j) => j === i ? true : val))}
                               FormHelperTextProps={{className: 'text-white -m-2'}}
                               SelectProps={{className: 'text-white text-sm'}}
                               InputLabelProps={{className: 'text-white'}}
                               InputProps={{ className: 'text-white text-sm'}} />
                    {modifiedTimes[i] && <div className="absolute right-0 top-0 bottom-0 flex items-center">
                        <IconButton onClick={() => {
                            setButtonDisabledState(i, true);
                            setErrorState(i, '');
                            ScheduledTaskService.rescheduleTask({ id: task._id, time: timeRefs.current[i]?.value ?? '' })
                                .then(() => setModifiedTimes(modifiedTimes.map((val, j) => j === i ? false : val)))
                                .catch(err => setErrorState(i, err?.message ?? err))
                                .finally(() => setButtonDisabledState(i, false));
                        }} >
                            <FaSave className="cursor-pointer text-white w-4 h-4"/>
                        </IconButton>
                    </div>}
                </div>


                <Button variant="outlined" size="small" color="inherit" disabled={disabledButtons[i]} onClick={() => {
                    setButtonDisabledState(i, true);
                    setErrorState(i, '');
                    ScheduledTaskService.runTask({ id: task._id, force: true })
                        .catch(err => setErrorState(i, err?.message ?? err))
                        .finally(() => setButtonDisabledState(i, false));
                }}>
                    Force Run
                </Button>
                <div className="p-1"></div>
                <Button variant="outlined" size="small" disabled={disabledButtons[i]} color="inherit" onClick={() => {
                    setButtonDisabledState(i, true);
                    setErrorState(i, '');
                    (task.status === 'running' ? ScheduledTaskService.abortTask({ id: task._id }) :
                        ScheduledTaskService.runTask({ id: task._id }))
                        .catch(err => setErrorState(i, err?.message ?? err))
                        .finally(() => setButtonDisabledState(i, false));
                }}>
                    {task.status === 'running' ? 'Abort' : 'Run'}
                </Button>
                <div className="p-1"></div>
            </div>))}
        </div>
    </div>)
}