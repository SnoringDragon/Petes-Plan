
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

const admin = require('../firebase'); // Make sure this points to your Firebase Admin init file
const User = require('../models/userModel');

module.exports.authenticate = async (req, res, next) => {
    const errorPayload = { message: 'Invalid user session' };
    let token;
    const authorization = req.headers.authorization;

    // 1. Extract the token (Keeping your exact same extraction logic)
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
        // 2. Let Google verify the signature (ZERO CPU cost for your server!)
        const decodedToken = await admin.auth().verifyIdToken(token);

        // 3. Find the MongoDB user using the email verified by Firebase
        // Since Google verified the token, we know 100% this email is authentic
        const user = await User.findOne({ email: decodedToken.email });

        // Invalid user (e.g., they exist in Firebase but were deleted from your DB)
        if (!user) {
            return res.status(401).json(errorPayload);
        }

        // 4. Attach user and token to the request so downstream routes work perfectly
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        // If the token is expired, tampered with, or invalid, Firebase throws an error
        console.error('Auth verification failed:', error.message);
        return res.status(401).json(errorPayload);
    }
}