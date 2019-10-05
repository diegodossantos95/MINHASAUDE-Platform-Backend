'use strict';

//DEBUG: https://stackoverflow.com/questions/45920014/functions-debugging-in-vs-code/50385649

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const physicianAPI = require('./modules/physicianAPI');
const uploadHealthData = require('./modules/uploadHealthData');

exports.physicianAPI = functions.https.onRequest(physicianAPI.handler);
exports.uploadHealthData = functions.https.onCall(uploadHealthData.handler);
