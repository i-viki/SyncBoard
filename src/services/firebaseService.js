// firebaseRoomService.js

import { ref, update, onValue, get, off } from "firebase/database";
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
    users: firebaseData?.users?.length
      ? firebaseData.users
      : [USER_UUID],
    lastUpdated: now,
    passwordHash: firebaseData?.passwordHash || null,
  });
};

/* ========================= */
/* ===== ADD USER ========== */
/* ========================= */

export const addUserToRoom = async (code, USER_UUID) => {
  const roomRef = getRoomRef(code);

  const snapshot = await get(roomRef);
  if (!snapshot.exists()) return;

  const data = snapshot.val();
  const existingUsers = data.users || [];

  if (!existingUsers.includes(USER_UUID)) {
    await update(roomRef, {
      users: [...existingUsers, USER_UUID],
    });
  }
};