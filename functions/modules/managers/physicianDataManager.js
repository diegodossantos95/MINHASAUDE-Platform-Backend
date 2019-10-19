'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const physicianCollectionName = "physicians";
const sharingPropertyName = "sharings";

const getSharings = sName => {
    //TODO: Handle if the document doesnt exist
    
    return db
        .collection(physicianCollectionName)
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

const getPhysicianDocRef = sName => {
    return db.collection(physicianCollectionName).doc(sName);
};

exports.getSharings = getSharings;
exports.getPhysicianDocRef = getPhysicianDocRef;