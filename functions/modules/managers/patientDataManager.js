'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const physicianDataManager = require('./physicianDataManager');
const patientCollectionName = "patients";
const sharingPropertyName = "sharings";
const changeLogsPropertyName = "changelogs";
const healthDataPropertyName = "healthData";
const CHANGELOG_MESSAGES = Object.freeze({
    HEALTH_DATA_DELETED: "HEALTH_DATA_DELETED",
    HEALTH_DATA_EXPIRED: "HEALTH_DATA_EXPIRED",
    HEALTH_DATA_SYNCED: "HEALTH_DATA_SYNCED",
    EXPIRATION_UPDATED: "EXPIRATION_UPDATED",
    SHARING_ADDED: "SHARING_ADDED",
    SHARING_DELETED: "SHARING_DELETED",
    HEALTH_DATA_READ: "HEALTH_DATA_READ"
})

const initDatabase = sPatientName => {
    const docRef = db.collection(patientCollectionName).doc(sPatientName);

    return docRef.get()
        .then(doc => {
            if (!doc.exists) {
                const currrentDate = Date.now() / 1000;

                return docRef.set({
                        expiration: 1,
                        healthData: {},
                        sharings: [],
                        changelogs: [],
                        syncDate: currrentDate
                    }, { merge: true });
            } else {
                return Promise.resolve();
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const getPatientData = (sPatientName, sPhysicianName) => {
    //TODO: Handle if the document doesnt exist
    
    _deleteHealthDataIfExpired(sPatientName);

    return db
        .collection(patientCollectionName)
        .doc(sPatientName)
        .get()
        .then(docSnapshot => {
            var oFilteredData = {};
            const oHealthData = docSnapshot.get(healthDataPropertyName);
            const oSharing = docSnapshot.get(sharingPropertyName).find(element => {
                return element.name === sPhysicianName;
            });
            
            oSharing.access.forEach(value => {
                oFilteredData[value] = oHealthData[value];
            });

            _addNewChangeLog(sPatientName, sPhysicianName, CHANGELOG_MESSAGES.HEALTH_DATA_READ);

            return Promise.resolve(oFilteredData);
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

    var batch = db.batch();
    var patientRef = db.collection(patientCollectionName).doc(sPatientName);
    var physicianRef = physicianDataManager.getPhysicianDocRef(sSharingId);
    
    batch.update(patientRef, {
        sharings: admin.firestore.FieldValue.arrayRemove(sSharingId)
    });

    batch.update(physicianRef, {
        sharings: admin.firestore.FieldValue.arrayRemove(sPatientName)
    });

    return batch
        .commit()
        .then(() => {
            _addNewChangeLog(sPatientName, sPatientName, CHANGELOG_MESSAGES.SHARING_DELETED);

            return Promise.resolve();
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const addSharing = (sPatientName, oSharing) => {
    _deleteHealthDataIfExpired(sPatientName);

    var batch = db.batch();
    var patientRef = db.collection(patientCollectionName).doc(sPatientName);
    var sSharingId = oSharing.name;
    var physicianRef = physicianDataManager.getPhysicianDocRef(sSharingId);
    
    batch.update(patientRef, {
        sharings: admin.firestore.FieldValue.arrayUnion(oSharing)
    });

    batch.update(physicianRef, {
        sharings: admin.firestore.FieldValue.arrayUnion(sPatientName)
    });

    return batch
        .commit()
        .then(() => {
            _addNewChangeLog(sPatientName, sPatientName, CHANGELOG_MESSAGES.SHARING_ADDED);

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
            _addNewChangeLog(sPatientName, sPatientName, CHANGELOG_MESSAGES.EXPIRATION_UPDATED);

            return Promise.resolve();
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const getExpirationAndSyncTimes = (sPatientName) => {
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
            const sync = doc.data().syncDate;

            return Promise.resolve({
                expiration: expiration,
                sync: sync
            });
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const updateHealthData = (sPatientName, oHealthData) => {
    _deleteHealthDataIfExpired(sPatientName);
    _addNewChangeLog(sPatientName, sPatientName, CHANGELOG_MESSAGES.HEALTH_DATA_SYNCED);

    const key = Object.keys(oHealthData)[0];
    const healthData = {}
    healthData[healthDataPropertyName + "." + key] = oHealthData[key]

    return _updateHealthData(sPatientName, healthData);
};

const deleteHealthData = (sPatientName) => {
    _addNewChangeLog(sPatientName, sPatientName, CHANGELOG_MESSAGES.HEALTH_DATA_DELETED);

    return _updateHealthData(sPatientName, {
        healthData:  {}
    });
};

const getChangeLogs = sName => {
    //TODO: Handle if the document doesnt exist

    _deleteHealthDataIfExpired(sName);

    return db
        .collection(patientCollectionName)
        .doc(sName)
        .get()
        .then(docSnapshot => {
            const changeLogs = docSnapshot.get(changeLogsPropertyName);

            return Promise.resolve(changeLogs);
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const _updateHealthData = (sPatientName, oHealthData) => {
    oHealthData.syncDate = Date.now() / 1000;

    return db
        .collection(patientCollectionName)
        .doc(sPatientName)
        .update(oHealthData)
        .then(() => {
            return Promise.resolve(oHealthData.syncDate);
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
            const currentDate = Date.now() / 1000;

            if (expiration <= currentDate) {
                _addNewChangeLog(sPatientName, sPatientName, CHANGELOG_MESSAGES.HEALTH_DATA_EXPIRED);

                return deleteHealthData(sPatientName);
            } else {
                return Promise.resolve();
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

const _addNewChangeLog = (sPatientName, sAuthor, sMessage) => {
    const currentDate = Date.now() / 1000;
    const oChangelog = {
        author: sAuthor,
        message: sMessage,
        date: currentDate
    };

    return db
        .collection(patientCollectionName)
        .doc(sPatientName)
        .update({
            changelogs: admin.firestore.FieldValue.arrayUnion(oChangelog)
        });
}

exports.initDatabase = initDatabase;
exports.getPatientData = getPatientData;
exports.getSharings = getSharings;
exports.deleteSharing = deleteSharing;
exports.addSharing = addSharing;
exports.updateExpiration = updateExpiration;
exports.getExpirationAndSyncTimes = getExpirationAndSyncTimes;
exports.updateHealthData = updateHealthData;
exports.deleteHealthData = deleteHealthData;
exports.getChangeLogs = getChangeLogs;
