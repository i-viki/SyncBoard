const UUID_KEY = "user_uuid";
const META_KEY = "user_meta";

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
  let meta = localStorage.getItem(META_KEY);

  if (meta) {
    meta = JSON.parse(meta);
    meta.lastChecked = Date.now();
    localStorage.setItem(META_KEY, JSON.stringify(meta));

    return meta;
  }

  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    const newMeta = {
      country: data.country || "Unknown",
      lastChecked: Date.now(),
    };

    localStorage.setItem(META_KEY, JSON.stringify(newMeta));
    return newMeta;
  } catch (error) {
    const fallback = {
      country: "Unknown",
      lastChecked: Date.now(),
    };

    localStorage.setItem(META_KEY, JSON.stringify(fallback));
    return fallback;
  }
}