// firebaseRoomService.js

import { ref, update, onValue, get, off, onDisconnect, set } from "firebase/database";
import { appDatabase } from "../config/firebase";

/* ========================= */
/* ===== ROOM REFERENCE ==== */
/* ========================= */

export const getRoomRef = (code) => {
  return ref(appDatabase, `rooms/${code}`);
};

/* ========================= */
/* ===== LISTENER ========== */
/* ========================= */

export const listenToRoom = (code, callback) => {
  const roomRef = getRoomRef(code);

  const unsubscribe = onValue(roomRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback(snapshot.val());
  });

  return () => off(roomRef, "value", unsubscribe);
};

/* ========================= */
/* ===== UPDATE ROOM ======= */
/* ========================= */

export const updateRoom = async (code, payload) => {
  const roomRef = getRoomRef(code);
  return update(roomRef, payload);
};

/* ========================= */
/* ===== GET ROOM ONCE ===== */
/* ========================= */

export const getRoomOnce = async (code) => {
  const roomRef = getRoomRef(code);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) return null;

  return snapshot.val();
};

/* ========================= */
/* ===== UPDATE TEXT ======= */
/* ========================= */

export const updateRoomText = async (
  code,
  value,
  firebaseData,
  USER_UUID
) => {
  const roomRef = getRoomRef(code);

  const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");

  return update(roomRef, {
    text: value,
    images: firebaseData?.images || [],
    lastUpdated: now,
    passwordHash: firebaseData?.passwordHash || null,
  });
};

/* ========================= */
/* ===== ADD USER ========== */
/* ========================= */

export const addUserToRoom = async (code, USER_UUID) => {
  // Removed legacy users array tracking to favor real-time presence
};

/* ========================= */
/* ===== PRESENCE ========== */
/* ========================= */

export const trackPresence = (code, SESSION_ID) => {
  const presenceRef = ref(appDatabase, `rooms/${code}/users/${SESSION_ID}`);
  const connectedRef = ref(appDatabase, ".info/connected");

  return onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      onDisconnect(presenceRef).remove();
      set(presenceRef, SESSION_ID);
    }
  });
};

export const listenToPresence = (code, callback) => {
  const presenceRef = ref(appDatabase, `rooms/${code}/users`);
  return onValue(presenceRef, (snap) => {
    if (snap.exists()) {
      callback(Object.keys(snap.val()).length);
    } else {
      callback(0);
    }
  });
};

/* ========================= */
/* ===== EXPIRATION ======== */
/* ========================= */

export const setBoardExpiration = async (code, minutes) => {
  const roomRef = getRoomRef(code);
  const expirationTime = minutes ? Date.now() + minutes * 60 * 1000 : null;
  return update(roomRef, { expirationTime });
};