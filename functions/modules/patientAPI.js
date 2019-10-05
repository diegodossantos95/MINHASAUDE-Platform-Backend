'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const patientDataManager = require('./managers/patientDataManager');

exports.uploadHealthData = (data, context) => {
    const weightData = data.weight;
    const result = db.collection("healthData").add({weight: weightData});
    return result;
};

//Read patient sharings
exports.readSharings = (data, context) => {
    const myUser = context.auth.token.email

    return patientDataManager.readSharings(myUser);
};
