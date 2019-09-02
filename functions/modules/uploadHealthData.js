'use strict';

const admin = require('firebase-admin');

exports.handler = (data, context) => {
    const weightData = data.weight;
    const result = admin.firestore().collection("healthData").add({weight: weightData});
    return result;
};
