'use strict';

const admin = require('firebase-admin');
const patientDataManager = require('./managers/patientDataManager');

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
