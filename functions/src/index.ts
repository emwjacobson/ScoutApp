import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { settings } from './settings';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { UserRecord, user } from 'firebase-functions/lib/providers/auth';

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

// TODO: Create function called whenever a user is deleted to remove them from the database.

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
        const user_db_data = {
            email: user_record.email,
            displayName: user_record.displayName,
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

// export const acceptUser = functions.https.onCall((data, context) => {
//     // Check if requesting user is an admin.
//     return admin.firestore().collection('users').where('uid', '==', context.auth.uid).get().then((admin_snap) => {
//         if (!admin_snap || admin_snap.empty) {
//             throw new HttpsError('not-found', 'User not found in database.');
//         }

//         if (!admin_snap.docs[0].data().admin) {
//             throw new HttpsError('permission-denied', 'You\'re not allowed to preform this action.');
//         }

//         // Check if accepted user exists
//         return admin.firestore().collection('users').where('uid', '==', data.uid).get().then((user_snap) => {
//             if (!user_snap || user_snap.empty) {
//                 throw new HttpsError('not-found', 'User not found in database.');
//             }

//             // User exists, so set limited to false
//             return admin.firestore().collection('users').doc(user_snap.docs[0].data().uid).update({ limited: false }).then(() => {
//                 return { success: true };
//             });
//         })
//     }).catch((error) => {
//         throw new HttpsError('internal', error.message);
//     });
// });

export const acceptUser = functions.https.onCall((data, context) => {
    // Check if requesting user is an admin.
    return admin.firestore().collection('users').where('uid', '==', context.auth.uid).get().then((admin_snap) => {
        if (!admin_snap || admin_snap.empty) {
            throw new HttpsError('not-found', 'User not found in database.');
        }

        if (!admin_snap.docs[0].data().admin) {
            throw new HttpsError('permission-denied', 'You\'re not allowed to preform this action.');
        }

        // Check if accepted user exists
        return admin.firestore().collection('users').where('uid', '==', data.uid).get();
    }).then((user_snap) => {
        if (!user_snap || user_snap.empty) {
            throw new HttpsError('not-found', 'User not found in database.');
        }

        // User exists, so set limited to false
        return admin.firestore().collection('users').doc(user_snap.docs[0].data().uid).update({ limited: false }).then(() => {
            return { success: true };
        });
    }).catch((error) => {
        throw new HttpsError('internal', error.message);
    });
});

// export const denyUser = functions.https.onCall((data, context) => {
//     // Check if requesting user is an admin.
//     return admin.firestore().collection('users').where('uid', '==', context.auth.uid).get().then((admin_snap) => {
//         if (!admin_snap || admin_snap.empty) {
//             throw new HttpsError('not-found', 'User not found in database.');
//         }

//         if (!admin_snap.docs[0].data().admin) {
//             throw new HttpsError('permission-denied', 'You\'re not allowed to preform this action.');
//         }

//         // Check if accepted user exists
//         return admin.firestore().collection('users').where('uid', '==', data.uid).get().then((user_snap) => {
//             if (!user_snap || user_snap.empty) {
//                 throw new HttpsError('not-found', 'User not found in database.');
//             }

//             // User exists, delete DB record
//             return admin.firestore().collection('users').doc(user_snap.docs[0].data().uid).delete().then(() => {

//                 // Delete Firebase Auth entry for the user.
//                 return admin.auth().deleteUser(user_snap.docs[0].data().uid).then(() => {
//                     return { success: true };
//                 });
//             });
//         })
//     }).catch((error) => {
//         throw new HttpsError('internal', error.message);
//     });
// });

// This implementation seems to more like how you should use a Promise...
export const denyUser = functions.https.onCall((data, context) => {
    // Check if requesting user is an admin.
    return admin.firestore().collection('users').where('uid', '==', context.auth.uid).get().then((admin_snap) => {
        if (!admin_snap || admin_snap.empty) {
            throw new HttpsError('not-found', 'User not found in database.');
        }

        if (!admin_snap.docs[0].data().admin) {
            throw new HttpsError('permission-denied', 'You\'re not allowed to preform this action.');
        }
        
        return admin_snap;
    }).then((admin_snap) => {
        // Check if accepted user exists
        return admin.firestore().collection('users').where('uid', '==', data.uid).get();
    }).then((user_snap) => {
        if (!user_snap || user_snap.empty) {
            throw new HttpsError('not-found', 'User not found in database.');
        }
        // User exists, delete DB record
        return admin.firestore().collection('users').doc(user_snap.docs[0].data().uid).delete().then(() => {
            // Delete Firebase Auth entry for the user.
            return admin.auth().deleteUser(user_snap.docs[0].data().uid);
        }).then(() => {
            return { success: true };
        });
    }).catch((error) => {
        throw new HttpsError('internal', error.message);
    });
});