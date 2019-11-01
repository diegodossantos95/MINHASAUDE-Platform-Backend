'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const physicianCollectionName = "physicians";
const sharingPropertyName = "sharings";

const initDatabase = sName => {
    const docRef = db.collection(physicianCollectionName).doc(sName);

    return docRef.get()
        .then(doc => {
            if (!doc.exists) {
                return docRef.set({
                        sharings: [],
                    }, { merge: true });
            } else {
                return Promise.resolve();
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const getSharings = sName => {  
    return db
        .collection(physicianCollectionName)
        .doc(sName)
        .get()
        .then(docSnapshot => {
            const sharings = docSnapshot.get(sharingPropertyName) || [];

            return Promise.resolve(sharings);
        })
        .catch(error => {
            return Promise.reject(error);
        });
};

const getPhysicianDocRef = sName => {
    return db.collection(physicianCollectionName).doc(sName);
};

const isShared = (sPhysicianName, sPatientName) => {
    return getSharings(sPhysicianName)
        .then(sharings => {
            if (sharings.indexOf(sPatientName) > -1) {
                return Promise.resolve();
            } else {
                throw new Error('Patient not shared!');
            }
        });
};

exports.initDatabase = initDatabase;
exports.getSharings = getSharings;
exports.getPhysicianDocRef = getPhysicianDocRef;
exports.isShared = isShared;
