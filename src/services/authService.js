// authService.js — Firebase Anonymous Authentication

import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { appAuth } from "../config/firebase";

/**
 * Shared promise that resolves once the user is authenticated.
 * Every caller that awaits this gets the same promise — auth only runs once.
 */
let authPromise = null;

export function ensureAnonymousAuth() {
  if (authPromise) return authPromise;

  authPromise = new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(appAuth, (user) => {
      unsubscribe(); // Only need the first emission

      if (user) {
        resolve(user.uid);
      } else {
        signInAnonymously(appAuth)
          .then((credential) => resolve(credential.user.uid))
          .catch((error) => {
            console.error("Anonymous auth failed:", error);
            reject(error);
          });
      }
    });
  });

  return authPromise;
}

/**
 * Returns the current Firebase user UID, or null if not signed in.
 */
export function getCurrentUid() {
  return appAuth.currentUser?.uid || null;
}
