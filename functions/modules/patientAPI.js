'use strict';

const patientDataManager = require('./managers/patientDataManager');

//Init patient data
exports.initPatientDatabase = (data, context) => {
    const myUser = context.auth.token.email;

    return patientDataManager.initDatabase(myUser);
};

//Read patient sharings
exports.getSharings = (data, context) => {
    const myUser = context.auth.token.email;

    return patientDataManager.getSharings(myUser);
};

//Delete sharing
exports.deleteSharing = (data, context) => {
    const myUser = context.auth.token.email;
    const sharingId = data.sharingId;

    return patientDataManager.deleteSharing(myUser, sharingId);
};

//Add new share
exports.addSharing = (data, context) => {
    const myUser = context.auth.token.email;
    const sharingId = data.sharingId;

    return patientDataManager.addSharing(myUser, sharingId);
};

//Update expiration
exports.updateExpiration = (data, context) => {
    const myUser = context.auth.token.email;
    const expirationTime = data.expiration;

    return patientDataManager.updateExpiration(myUser, expirationTime);
};

//Update health data
exports.updateHealthData = (data, context) => {
    const myUser = context.auth.token.email;
    const healthData = data.healthData;

    return patientDataManager.updateHealthData(myUser, healthData);
};

//Delete health data
exports.deleteHealthData = (data, context) => {
    const myUser = context.auth.token.email;

    return patientDataManager.deleteHealthData(myUser);
};

//Read patient expiration time
exports.getExpirationAndSyncTimes = (data, context) => {
    const myUser = context.auth.token.email;

    return patientDataManager.getExpirationAndSyncTimes(myUser);
};