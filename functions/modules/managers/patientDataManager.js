'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const patientCollectionName = "patients";
const sharingPropertyName = "sharings";
const healthDataPropertyName = "healthData";

const getPatientData = sName => {
    //TODO: Handle if the document doesnt exist
    
    return db
        .collection(patientCollectionName)
        .doc(sName)
        .get()
        .then(docSnapshot => {
            const docs = docSnapshot.get(healthDataPropertyName);

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
        .get()
        .then(docSnapshot => {
            const sharings = docSnapshot.get(sharingPropertyName);

            return Promise.resolve(sharings);
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const deleteSharing = (sPatientName, sSharingId) => {
    return db
        .collection(patientCollectionName)
        .doc(sPatientName)
        .update({
            sharings: admin.firestore.FieldValue.arrayRemove(sSharingId)
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const addSharing = (sPatientName, sSharingId) => {
    return db
        .collection(patientCollectionName)
        .doc(sPatientName)
        .update({
            sharings: admin.firestore.FieldValue.arrayUnion(sSharingId)
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const updateExpiration = (sPatientName, iMillis) => {
    return db
        .collection(patientCollectionName)
        .doc(sPatientName)
        .update({
            expiration: admin.firestore.Timestamp.fromMillis(iMillis)
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

exports.getPatientData = getPatientData;
exports.getSharings = getSharings;
exports.deleteSharing = deleteSharing;
exports.addSharing = addSharing;
exports.updateExpiration = updateExpiration;