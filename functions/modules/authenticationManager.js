'use strict';

const check = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        console.error("Request without the authorization headers.");
        res.status(403).send('Unauthorized');
        return;
    }
    
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
        console.debug("User logged successfully.");
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedIdToken;
        next();
        return;
    } catch(e) {
        console.error(`Error: ${e}`);
        res.status(403).send('Unauthorized');
        return;
    }
};

exports.check = check;