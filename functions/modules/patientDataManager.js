'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const patientCollectionName = "patients";

const readData = sName => {
    return db.collection(patientCollectionName).doc(sName).get().then(doc => {
        if (doc.exists) {
            const healthData = doc.data;
            return Promise.resolve(healthData);
        } else {            
            return Promise.reject("Invalid Patient");
        }
    });
};

exports.readData = readData;