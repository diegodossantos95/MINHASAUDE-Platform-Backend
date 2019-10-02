'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const physicianCollectionName = "physicians";

const readData = sName => {
    return db.collection(physicianCollectionName).doc(sName).get().then(doc => {
        if (doc.exists) {
            return Promise.resolve(doc);
        } else {            
            return createFirstTimeData(sName);
        }
    });
};

const createFirstTimeData = sName => {
    return db.collection(physicianCollectionName).doc(sName).set({
        sharings: []
    });
};

exports.readData = readData;