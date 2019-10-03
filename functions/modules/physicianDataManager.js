'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const physicianCollectionName = "physicians";
const sharingCollectionName = "sharings";

const readSharings = sName => {
    return db.collection(physicianCollectionName).doc(sName).get().then(doc => {
        if (doc.exists) {
            return Promise.resolve(doc[sharingCollectionName]);
        } else {            
            return createFirstTimeData(sName).then(oData => {
                return oData[sharingCollectionName];
            });
        }
    });
};

const createFirstTimeData = sName => {
    var physicianObject = {};
    physicianObject[sharingCollectionName] = [];

    return db.collection(physicianCollectionName).doc(sName).set(physicianObject);
};
exports.readSharings = readSharings;