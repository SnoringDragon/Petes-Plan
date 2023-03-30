const jwt = require('jsonwebtoken');
const util = require('util');

const secret = require('../secret');
const User = require('../models/userModel');

const verify = util.promisify(jwt.verify);

module.exports.authenticate = async (req, res, next) => {
    const errorPayload = { message: 'Invalid user session' };

    let token;

    const authorization = req.headers.authorization;

    // expected format: Bearer {token}
    if (authorization) {
        if (!authorization.startsWith('Bearer '))
            return res.status(401).json(errorPayload);
        token = authorization.replace(/^Bearer /, '');
    } else if (req.cookies.token) {
        token = req.cookies.token;
    } else {
        return res.status(401).json(errorPayload);
    }

    // unsafe decode without checking signature
    // need to do this since we sign based on the user's password
    let unsafePayload;
    try {
        unsafePayload = jwt.decode(token);
    } catch {}

    // invalid token or could not decode
    if (!unsafePayload || !unsafePayload._id)
        return res.status(401).json(errorPayload);

    const user = await User.findOne({ _id: unsafePayload._id });

    // invalid user id
    if (!user)
        return res.status(401).json(errorPayload);

    // token blacklisted (logout)
    if (user.tokenBlacklist.includes(token))
        return res.status(401).json(errorPayload);

    const verifiedPayload = await verify(token, user.permuteKey(secret))
        .catch(() => null);

    // invalid signature
    if (!verifiedPayload)
        return res.status(401).json(errorPayload);

    await user.filterBlacklist();
    // assign user for route to use
    req.user = user;
    req.token = token;

    next();
}
