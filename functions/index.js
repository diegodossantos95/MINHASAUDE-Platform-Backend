'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const physicianAPI = require('./modules/physicianAPI');
const uploadHealthData = require('./modules/uploadHealthData');

admin.initializeApp();

exports.physicianAPI = functions.https.onRequest(physicianAPI.handler);
exports.uploadHealthData = functions.https.onCall(uploadHealthData.handler);
