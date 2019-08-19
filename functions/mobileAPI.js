'use strict';

const admin = require('firebase-admin');

exports.handler = (data, context) => {
    if (!context.auth) {
        return {
            status: 'error', 
            code: 401, 
            message: 'Not signed in'
        }
    } else {
        var userId = context.auth.uid;
        return admin.auth().getUser(userId);
        // return new Promise((resolve, reject) => {
        //     // find a user by data.uid and return the result

        //     resolve(user)
        //   })
    }
};
