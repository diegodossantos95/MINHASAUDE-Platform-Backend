'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const patientCollectionName = "patients";
const sharingPropertyName = "sharings";
const healthDataPropertyName = "healthData";

const getPatientData = sName => {
    //TODO: Handle if the document doesnt exist
    
    _deleteHealthDataIfExpired(sName);

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

    _deleteHealthDataIfExpired(sName);

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
    _deleteHealthDataIfExpired(sPatientName);

    //TODO: delete sharing from the physician

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
    _deleteHealthDataIfExpired(sPatientName);

    //TODO: add sharing to the physician

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

const updateExpiration = (sPatientName, iDays) => {
    _deleteHealthDataIfExpired(sPatientName);

    return db
        .collection(patientCollectionName)
        .doc(sPatientName)
        .update({
            expiration: iDays
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const getExpiration = (sPatientName) => {
    _deleteHealthDataIfExpired(sPatientName);

    return db
        .collection(patientCollectionName)
        .doc(sPatientName)
        .get()
        .then(doc => {
            if (!doc.exists) {
              throw new Error('Doc does not exist!');
            }
      
            const expiration = doc.data().expiration;

            return Promise.resolve(expiration);
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const updateHealthData = (sPatientName, oHealthData) => {
    _deleteHealthDataIfExpired(sPatientName);

    const key = Object.keys(oHealthData)[0];
    const healthData = {}
    healthData[healthDataPropertyName + "." + key] = oHealthData[key]

    return _updateHealthData(sPatientName, healthData);
};

const deleteHealthData = (sPatientName) => {
    return _updateHealthData(sPatientName, {
        healthData:  {}
    });
};

const _updateHealthData = (sPatientName, oHealthData) => {
    const currentDate = new Date();
    oHealthData.syncDate = currentDate.getTime();

    return db
        .collection(patientCollectionName)
        .doc(sPatientName)
        .update(oHealthData)
        .then(() => {
            return Promise.resolve();
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const _deleteHealthDataIfExpired = (sPatientName) => {
    return db
        .collection(patientCollectionName)
        .doc(sPatientName)
        .get()
        .then(doc => {
            if (!doc.exists) {
              throw new Error('Doc does not exist!');
            }
      
            const milliInDay = 24*60*60*1000;
            const iDaysToExpire = doc.data().expiration;
            const syncDate = doc.data().syncDate;
            const expiration = syncDate + (iDaysToExpire * milliInDay);

            if (expiration <= Date.now()) {
                return deleteHealthData(sPatientName);
            } else {
                return Promise.resolve();
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

exports.getPatientData = getPatientData;
exports.getSharings = getSharings;
exports.deleteSharing = deleteSharing;
exports.addSharing = addSharing;
exports.updateExpiration = updateExpiration;
exports.getExpiration = getExpiration;
exports.updateHealthData = updateHealthData;
exports.deleteHealthData = deleteHealthData;