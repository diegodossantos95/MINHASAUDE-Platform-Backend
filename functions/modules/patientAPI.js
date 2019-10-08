'use strict';

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