exports.getDegreePlans = (req, res) => {
    return res.status(200).json({
        message: 'Successfully retrieved degree plans',
        path: req.path
    });
};

exports.addDegreePlan = (req, res) => {
    return res.status(200).json({
        message: 'Successfully created new degree plan',
        path: req.path
    });
};

exports.deleteDegreePlan = (req, res) => {
    return res.status(200).json({
        message: 'Successfully deleted degree plan',
        path: req.path
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