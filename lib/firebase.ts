/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { initializeApp } from "firebase/app";
import { 
    initializeAuth, 
    indexedDBLocalPersistence,
    browserLocalPersistence,
    browserPopupRedirectResolver,
    GoogleAuthProvider 
} from "firebase/auth";
import { firebaseConfig } from './firebaseConfig';

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);

// Exporteer Firebase auth instanties voor gebruik in de app
// Door expliciet te initialiseren met browserPopupRedirectResolver en persistence,
// kunnen we problemen met pop-ups in bepaalde omgevingen oplossen.
export const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
});

export const googleProvider = new GoogleAuthProvider();