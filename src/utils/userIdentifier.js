const UUID_KEY = "user_uuid";

function generateUUID() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function userIdentifier() {
  let uuid = localStorage.getItem(UUID_KEY);

  if (!uuid) {
    uuid = generateUUID();
    localStorage.setItem(UUID_KEY, uuid);
  }

  return uuid;
}

export function sessionIdentifier() {
  const SESSION_KEY = "session_uuid";
  let uuid = sessionStorage.getItem(SESSION_KEY);

  if (!uuid) {
    uuid = generateUUID();
    sessionStorage.setItem(SESSION_KEY, uuid);
  }

  return uuid;
}

export async function userMetadata() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const languages = navigator.languages ? navigator.languages.join(", ") : navigator.language || "Unknown";

  return {
    timezone,
    languages,
    lastChecked: Date.now(),
  };
}