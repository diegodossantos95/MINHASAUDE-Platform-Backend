'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const patientCollectionName = "patients";
const healthDataCollectionName = "data";
const sharingCollectionName = "sharings";

const getPatientData = sName => {
    //TODO: Handle if the document doesnt exist
    
    return db
        .collection(patientCollectionName)
        .doc(sName)
        .collection(healthDataCollectionName)
        .get()
        .then(querySnapshot => {
            const docs = querySnapshot.docs.map(document => {
                return document.data();
            });

            return Promise.resolve(docs);
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const getSharings = sName => {
    //TODO: Handle if the document doesnt exist

    return db
        .collection(patientCollectionName)
        .doc(sName)
        .collection(sharingCollectionName)
        .get()
        .then(querySnapshot => {
            const docs = querySnapshot.docs.map(document => {
                return document.data();
            });

            return Promise.resolve(docs);
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

exports.getPatientData = getPatientData;
exports.getSharings = getSharings;