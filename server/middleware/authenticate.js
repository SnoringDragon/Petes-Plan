const jwt = require('jsonwebtoken');
const util = require('util');

const User = require('../models/userModel');

const verify = util.promisify(jwt.verify);

const SECRET_KEY = Buffer.from(process.env.JWT_SECRET_KEY, 'latin1');
delete process.env.JWT_SECRET_KEY;

module.exports.authenticate = async (req, res, next) => {
    const errorPayload = { error: true, message: 'Invalid user session' };

    const authorization = req.headers.authorization;

    // expected format: Bearer {token}
    if (!authorization || !authorization.startsWith('Bearer '))
        return res.status(400).json(errorPayload);

    const token = authorization.replace(/^Bearer /, '');

    // unsafe decode without checking signature
    // need to do this since we sign based on the user's password
    const unsafePayload = jwt.decode(token);

    // invalid token or could not decode
    if (!unsafePayload || !unsafePayload._id)
        return res.status(400).json(errorPayload);

    const user = await User.findOne({ _id: unsafePayload._id });

    // invalid user id
    if (!user)
        return res.status(400).json(errorPayload);

    const verifiedPayload = await verify(token, user.permuteKey(SECRET_KEY))
        .catch(() => null);

    // invalid signature
    if (!verifiedPayload)
        return res.status(400).json(errorPayload);

    // assign user for route to use
    req.user = user;

    next();
}

module.exports.secret = SECRET_KEY;
