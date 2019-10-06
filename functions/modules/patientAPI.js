'use strict';

const admin = require('firebase-admin');
const patientDataManager = require('./managers/patientDataManager');

//Read patient sharings
exports.getSharings = (data, context) => {
    const myUser = context.auth.token.email

    return patientDataManager.getSharings(myUser);
};
