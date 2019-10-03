'use strict';

const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();
const physicianDataManager = require('./physicianDataManager');
const patientDataManager = require('./patientDataManager');

const authenticate = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        console.error("Request without the authorization headers.");
        res.status(403).send('Unauthorized');
        return;
    }
    
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
        console.debug("User logged successfully.");
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedIdToken;
        next();
        return;
    } catch(e) {
        console.error(`Error: ${e}`);
        res.status(403).send('Unauthorized');
        return;
    }
};

app.use(cors);
app.use(cookieParser);
app.use(authenticate);

// View my sharings
app.get('/mySharings', (req, res) => {
    const myUser = req.user.email;

    physicianDataManager.readSharings(myUser)
    .then( data => {
        res.json(data);
    }, error => {
        res.status(500).json(error);
    });
});

// View patient data
app.get('/patient/:patientId', (req, res) => {
    const patientId = req.params.patientId;
    // Validate if  is shared with me
    // const myUser = req.user.email;

    patientDataManager.readData(patientId)
    .then( data => {
        res.json(data);
    }, error => {
        res.status(500).json(error);
    });
});

exports.handler = app;
