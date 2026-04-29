
// const jwt = require('jsonwebtoken');
// const util = require('util');

// const secret = require('../secret');
// const User = require('../models/userModel');
// const admin = require('../firebase'); // 🚨 NEW: Import your Firebase Admin config

// const verify = util.promisify(jwt.verify);

// // ─── OPTION 1: THE ORIGINAL LOCAL AUTHENTICATION ─────────────────────────────
// // This uses your local MongoDB, bcrypt, and custom JWT logic.
// module.exports.authenticate = async (req, res, next) => {
//     const errorPayload = { message: 'Invalid user session' };

//     let token;
//     const authorization = req.headers.authorization;

//     // expected format: Bearer {token}
//     if (authorization) {
//         if (!authorization.startsWith('Bearer '))
//             return res.status(401).json(errorPayload);
//         token = authorization.replace(/^Bearer /, '');
//     } else if (req.cookies && req.cookies.token) {
//         token = req.cookies.token;
//     } else if (req.query && req.query.token) {
//         token = req.query.token;
//     } else {
//         return res.status(401).json(errorPayload);
//     }

//     // unsafe decode without checking signature
//     let unsafePayload;
//     try {
//         unsafePayload = jwt.decode(token);
//     } catch {}

//     // invalid token or could not decode
//     if (!unsafePayload || !unsafePayload._id)
//         return res.status(401).json(errorPayload);

//     const user = await User.findOne({ _id: unsafePayload._id });

//     // invalid user id
//     if (!user)
//         return res.status(401).json(errorPayload);

//     // token blacklisted (logout)
//     if (user.tokenBlacklist.includes(token))
//         return res.status(401).json(errorPayload);

//     const verifiedPayload = await verify(token, user.permuteKey(secret))
//         .catch(() => null);

//     // invalid signature
//     if (!verifiedPayload)
//         return res.status(401).json(errorPayload);

//     await user.filterBlacklist();
//     // assign user for route to use
//     req.user = user;
//     req.token = token;

//     next();
// }
const jwt = require('jsonwebtoken');
const util = require('util');

const secret = require('../secret');
const admin = require('./firebase');
const User = require('../models/userModel');

module.exports.authenticate = async (req, res, next) => {
    const errorPayload = { message: 'Invalid user session' };
    let token;
    const authorization = req.headers.authorization;

    if (authorization) {
        if (!authorization.startsWith('Bearer ')) {
            return res.status(401).json(errorPayload);
        }
        token = authorization.replace(/^Bearer /, '');
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.query && req.query.token) {
        token = req.query.token;
    } else {
        return res.status(401).json(errorPayload);
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        const user = await User.findOne({ email: decodedToken.email });

        if (!user) {
            return res.status(401).json(errorPayload);
        }

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        console.error('Auth verification failed:', error.message);
        return res.status(401).json(errorPayload);
    }
}