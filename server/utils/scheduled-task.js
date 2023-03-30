const { EventEmitter } = require('events');
const ScheduledTaskModel = require('../models/scheduledTaskModel');

const { scheduleRepeat } = require('./scheduler');

class ScheduledTask extends EventEmitter {
    #taskfunc;
    #args;
    #dependencies;

    #lastSchedule;
    #abort;

    #logLines = [];

    constructor({ taskfunc, args, model, dependencies }) {
        super();

        this.#taskfunc = taskfunc;
        this.model = model;
        this.#args = args;
        this.#dependencies = dependencies;
        this.#abort = null;
        this.#lastSchedule = null;

        this.reschedule(model.scheduledAt);

        dependencies.forEach(d => d.on('status', () => {
            if (this.status === 'deferred' && dependencies.every(d => d.status === 'successful'))
                this.run();
        }));
    }

    #setStatus(status) {
        this.model.status = status;
        this.emit('status', status);
        this.model.save();
    }

    async reschedule(time) {
        if (this.#lastSchedule)
            this.#lastSchedule.cancel();

        this.#lastSchedule = scheduleRepeat(() => {
            if (this.model.status !== 'running')
                this.run();
        }, time);

        if (time !== this.model.scheduledAt) {
            this.model.scheduledAt = time;
            await this.model.save();
        }
    }

    #appendLogLine(...args) {
        const line = args.map(a => {
            const type = typeof a;

            if (type === 'undefined')
                return 'undefined';
            if (type === 'object') {
                if (a?.toString !== Object.prototype.toString) // custom toString
                    return a.toString();
                return JSON.stringify(a, null, 2);
            }

            return a.toString();
        }).join(' ');

        this.#logLines.push(line);
        if (this.#logLines.length > 100) this.#logLines.shift();

        this.emit('log', line);
    }

    run(args, force=false) {
        if (this.model.status === 'running' && !force)
            throw new Error('task is already running');

        if (this.#dependencies.some(d => d.status !== 'successful') && !force) {
            this.#setStatus('deferred');
            return;
        }

        this.#abort = new AbortController();

        this.model.lastRun = new Date();
        this.#setStatus('running');
        this.#taskfunc({
            ...this.#args, ...args, abort: this.#abort,
            log: (...args) => {
                const now = new Date()
                    .toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' });
                console.log(...args);
                this.#appendLogLine(`[${this.model.name}]`, now, ...args);
            },
            error: (...args) => {
                const now = new Date()
                    .toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' });
                console.error(...args);
                this.#appendLogLine(`[${this.model.name}]`, now, ...args);
            }
        })
            .then(() => {
                if (this.status !== 'aborted')
                    this.#setStatus('successful');
            })
            .catch(err => {
                if (this.status !== 'aborted')
                    this.#setStatus('errored');
            });
    }

    cancel() {
        if (this.model.status !== 'running')
            throw new Error('task is not running');
        this.#setStatus('aborted');
        this.#abort.abort();
    }

    get status() {
        return this.model.status;
    }

    static async create({ taskfunc, name, args = {}, dependencies = [] }) {
        const model = await ScheduledTaskModel.findOneAndUpdate({ name }, {}, { upsert: true, new: true });
        return new ScheduledTask({ taskfunc, args, model, dependencies });
    }

    toJSON() {
        const obj = this.model.toObject();

        return { ...obj, log: this.#logLines };
    }
}

module.exports = ScheduledTask;
