const UUID_KEY = "user_uuid";
const META_KEY = "user_meta";

export function userIdentifier() {
  let uuid = localStorage.getItem(UUID_KEY);

  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(UUID_KEY, uuid);
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