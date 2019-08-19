'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const httpModule = require('./httpAPI');
const mobileModule = require('./mobileAPI');

admin.initializeApp();

exports.httpAPI = functions.https.onRequest(httpModule.handler);
exports.mobileAPI = functions.https.onCall(mobileModule.handler);
