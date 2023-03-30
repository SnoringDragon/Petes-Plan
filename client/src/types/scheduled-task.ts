export type ScheduledTask = {
    _id: string,
    name: string,
    scheduledAt: string,
    status: 'running' | 'successful' | 'interrupted' | 'errored' | 'aborted' | 'unknown' | 'deferred',
    log: string[],
    lastRun: string
};
