'use strict';

//DEBUG: https://stackoverflow.com/questions/45920014/functions-debugging-in-vs-code/50385649

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const physicianAPI = require('./modules/physicianAPI');
const patientAPI = require('./modules/patientAPI');

exports.physicianAPI = functions.https.onRequest(physicianAPI.handler);
exports.getSharings = functions.https.onCall(patientAPI.getSharings);
exports.deleteSharing = functions.https.onCall(patientAPI.deleteSharing);
