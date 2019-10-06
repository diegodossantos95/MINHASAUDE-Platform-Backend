'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();
const physicianCollectionName = "physicians";
const sharingCollectionName = "sharings";

const getSharings = sName => {
    //TODO: Handle if the document doesnt exist
    
    return db
        .collection(physicianCollectionName)
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

exports.getSharings = getSharings;