const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        // This still uses the service account attached to the Cloud Run instance
        credential: admin.credential.applicationDefault(),
        // THIS IS THE FIX: It forces the SDK to validate tokens for your petes-plan project
        projectId: "petes-plan", 
    });
}

module.exports = admin;