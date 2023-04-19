const { Router } = require('express');
const { authenticate } = require('../middleware/authenticate');
const tasks = require('../tasks');
const parser = require('cron-parser');

module.exports = app => {
    const router = Router();

    router.get('/', (req, res) => {
        return res.json(tasks());
    });

    const findTask = (req, res, next) => {
        const taskList = tasks();
        const task = taskList.find(task => task.model.name === req.body.name ||
            task.model._id.toString() === req.body.id);
        if (!task)
            return res.status(400).json({ message: 'task not found '});

        req.task = task;
        next();
    };

    router.post('/abort', findTask, (req, res) => {
        try {
            req.task.cancel();
        } catch (e) {
            return res.status(400).json({ message: e.message })
        }
        res.json({});
    });

    router.post('/run', findTask, (req, res) => {
        try {
            req.task.run(req.body.args, req.body.force)
            res.json({});
        } catch (e) {
            res.status(400).json({ message: e?.message ?? e });
        }
    });

    router.post('/reschedule', findTask, async (req, res) => {
        try {
            parser.parseExpression(req.body.time);
        } catch {
            return res.status(400).json({ message: 'invalid time specification' });
        }

        await req.task.reschedule(req.body.time);
        return res.json({});
    });

    router.get('/events', (req, res) => {
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // flush the headers to establish SSE with client

        res.write(`data: ${JSON.stringify({
            data: tasks(),
            type: 'initial'
        })}\n\n`)

        const onEnd = [];

        tasks().forEach(task => {
            const logListener = data => {
                res.write(`data: ${JSON.stringify({data, type: 'log'})}\n\n`);
            };
            task.on('log', logListener);

            const statusListener = status => {
                res.write(`data: ${JSON.stringify({
                    data: {status, id: task.model._id},
                    type: 'status'
                })}\n\n`);
            };
            task.on('status', statusListener);

            onEnd.push(() => {
                task.off('log', logListener);
                task.off('status', statusListener);
            });
        });

        res.on('close', () => {
            res.end();
            onEnd.forEach(f => f());
        });
    });

    app.use('/api/admin/scheduled-task', authenticate, (req, res, next) => {
        if (!req.user.isAdmin)
            return res.status(403).json({ message: 'Unauthorized' });
        next();
    }, router);
};
