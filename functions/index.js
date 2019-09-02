'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const httpModule = require('./modules/httpAPI');
const uploadHealthData = require('./modules/uploadHealthData');

admin.initializeApp();

exports.httpAPI = functions.https.onRequest(httpModule.handler);
exports.uploadHealthData = functions.https.onCall(uploadHealthData.handler);
