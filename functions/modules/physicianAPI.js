'use strict';

const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();
const physicianDataManager = require('./managers/physicianDataManager');
const patientDataManager = require('./managers/patientDataManager');
const authManager = require('./managers/authenticationManager');

app.use(cors);
app.use(cookieParser);
app.use(authManager.check);

// View my sharings
app.get('/mySharings', (req, res) => {
    const myUser = req.user.email;

    physicianDataManager.initDatabase(myUser);

    physicianDataManager.getSharings(myUser)
        .then( data => {
            res.json(data);
            return;
        })
        .catch( error => {
            res.status(500).send(error);
        });
});

// View patient data
app.get('/patient/:patientId', (req, res) => {
    const myUser = req.user.email;
    const patientId = req.params.patientId;

    physicianDataManager.isShared(myUser, patientId)
        .then(() => {
            return patientDataManager.getPatientData(patientId, myUser);
        })
        .then( data => {
            res.json(data);
            return;
        })
        .catch( error => {
            res.status(500).send(error);
        });
});

exports.handler = app;
