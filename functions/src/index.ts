import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { settings } from './settings';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { UserRecord } from 'firebase-functions/lib/providers/auth';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: settings.databaseURL
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*
 * User Ranks are as follows:
 *  admin - access to everything on frontend
 *  normal - basic user, can do most scouting things
 *  limited - cannot scout until approved by an admin
 * 
 */


export const registerUser = functions.https.onCall((data, context) => {
    if (typeof data.email !== 'string' || data.email === '') {
        throw new HttpsError('invalid-argument', 'Invalid email address entered.');
    }
    if (typeof data.password !== 'string' || data.password === '') {
        throw new HttpsError('invalid-argument', 'Invalid password entered.');
    }
    if (typeof data.displayName !== 'string' || data.displayName === '') {
        throw new HttpsError('invalid-argument', 'Invalid name entered.');
    }

    const user_data = {
        email: data.email,
        password: data.password,
        displayName: data.displayName,
    }

    return admin.auth().createUser(user_data).then((user_record: UserRecord) => {
        // return admin.auth().setCustomUserClaims(user_record.uid, user_claims).then(() => {
        const user_db_data = {
            // TODO: Maybe also include email?
            uid: user_record.uid,
            admin: false,
            limited: true
        }
        return admin.firestore().collection('users').doc(user_record.uid).set(user_db_data).then(() => {
            // TODO: Dont return user_record? Not really needed on frontend and will trim down on data transfer.
            return { success: true };
        }).catch((error) => {
            switch (error.code) {
                // case 'auth/invalid-claims':
                //     throw new HttpsError('invalid-argument', 'Attempted to add invalid claim to user.');
                // case 'auth/reserved-claims':
                //     throw new HttpsError('invalid-argument', 'Attempted to use reserved claim value.');
                default:
                    throw new HttpsError('internal', error.message);
            }
        });
    }).catch((error) => {
        switch (error.code) {
            case 'auth/invalid-argument':
                throw new HttpsError('invalid-argument', error.message);
            case 'auth/invalid-display-name':
                throw new HttpsError('invalid-argument', error.message);
            case 'auth/invalid-email':
                throw new HttpsError('invalid-argument', error.message);
            case 'auth/invalid-password':
                throw new HttpsError('invalid-argument', error.message);
            case 'auth/email-already-exists':
                throw new HttpsError('already-exists', error.message);
            case 'auth/internal-error':
                console.log('Internal Error: ', error.code, error.message);
                throw new HttpsError('internal', error.message);
            default:
                console.log('Internal Error: ', error.code, error.message);
                throw new HttpsError('internal', error.message);
        }
    });
});

// This function is unfinished, do not use it until it is finished.
export const updateUser = functions.https.onCall((data, context) => {
    //
})

export const getLimitedUsers = functions.https.onCall((data, context) => {
    //
});