'use strict';

//DEBUG: https://stackoverflow.com/questions/45920014/functions-debugging-in-vs-code/50385649

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const physicianAPI = require('./modules/physicianAPI');
const patientAPI = require('./modules/patientAPI');

// PhysicianAPI
exports.physicianAPI = functions.https.onRequest(physicianAPI.handler);

// PatientAPI
exports.initPatientDatabase = functions.https.onCall(patientAPI.initPatientDatabase);
exports.getSharings = functions.https.onCall(patientAPI.getSharings);
exports.deleteSharing = functions.https.onCall(patientAPI.deleteSharing);
exports.addSharing = functions.https.onCall(patientAPI.addSharing);
exports.updateExpiration = functions.https.onCall(patientAPI.updateExpiration);
exports.getExpirationAndSyncTimes = functions.https.onCall(patientAPI.getExpirationAndSyncTimes);
exports.updateHealthData = functions.https.onCall(patientAPI.updateHealthData);
exports.deleteHealthData = functions.https.onCall(patientAPI.deleteHealthData);
exports.getChangeLogs = functions.https.onCall(patientAPI.getChangeLogs);
