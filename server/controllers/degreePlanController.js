exports.getDegreePlans = (req, res) => {
    return res.status(200).json({
        message: 'Successfully retrieved degree plans',
        degreePlans: req.user.degreePlans
    });
};

exports.addDegreePlan = (req, res) => {
    /* Validate degree plan name is not empty */
    if (!req.body.name) {
        return res.status(400).json({
            message: 'Degree plan must have a name'
        });
    }

    /* Validate degree plan name is unique */
    for (let i = 0; i < req.user.degreePlans.length; i++) {
        if (req.user.degreePlans[i].name === req.body.name) {
            return res.status(400).json({
                message: 'Degree plan name already in use',
                name: req.body.name
            });
        }
    }

    /* Add degree plan to user */
    req.user.degreePlans.push({
        name: req.body.name,
    });

    /* Save the user to the database */
    req.user.save().then(() => {
        return res.status(201).json({
            message: 'Successfully created new degree plan',
            degreePlan: req.user.degreePlans[req.user.degreePlans.length - 1]
        });
    }).catch((err) => {
        console.log(err.message);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
};

exports.deleteDegreePlan = (req, res) => {
    const _ids = req.body._ids;

    /* Check if degree plan _ids are provided */
    if (!_ids || !(_ids instanceof Array) || _ids.length === 0) {
        return res.status(400).json({
            message: 'Missing array of _ids'
        });
    }

    /* Attempt to find and remove degree plan(s) */
    for (let i = 0; i < _ids.length; i++) {
        const degreePlan = req.user.degreePlans.id(_ids[i]);

        if (!degreePlan) {
            return res.status(400).json({
                message: 'Invalid degree plan _id',
                _id: _ids[i]
            });
        }

        degreePlan.remove();
    }

    /* Save the user to the database */
    req.user.save().then(() => {
        return res.status(200).json({
            message: 'Successfully deleted degree plan(s)'
        });
    }).catch((err) => {
        console.log(err.message);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
};

exports.addCourse = (req, res) => {
    return res.status(200).json({
        message: 'Successfully added course to degree plan',
        path: req.path
    });
};

exports.modifyCourse = (req, res) => {
    return res.status(200).json({
        message: 'Successfully modified course in degree plan',
        path: req.path
    });
};

exports.removeCourse = (req, res) => {
    return res.status(200).json({
        message: 'Successfully removed course from degree plan',
        path: req.path
    });
};

exports.getDegreePlan = (req, res) => {
    return res.status(200).json({
        message: 'Successfully retrieved degree plan',
        path: req.path
    });
};