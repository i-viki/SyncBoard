import { logEvent, setUserProperties, setUserId } from "firebase/analytics";
import { appAnalytics } from "../config/firebase";
import { userIdentifier, userMetadata } from "../utils/userIdentifier";

const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    let os = "Unknown";
    let device = "Desktop";

    // Browser Detection
    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
    else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
    else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) browser = "Edge";
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";

    // OS Detection
    if (ua.indexOf("Win") > -1) os = "Windows";
    else if (ua.indexOf("Mac") > -1) os = "macOS";
    else if (ua.indexOf("Linux") > -1) os = "Linux";
    else if (ua.indexOf("Android") > -1) os = "Android";
    else if (ua.indexOf("like Mac") > -1) os = "iOS";

    // Device Type
    if (/Mobi|Android/i.test(ua)) device = "Mobile";
    else if (/Tablet|iPad/i.test(ua)) device = "Tablet";

    return {
        browser,
        os,
        device,
        resolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language
    };
};

async function getUserContext() {
  const uuid = userIdentifier();
  const meta = await userMetadata();
  const device = getDeviceInfo();

  const context = {
    uuid,
    country: meta?.country || "Unknown",
    city: meta?.city || "Unknown",
    region: meta?.region || "Unknown",
    isp: meta?.isp || "Unknown",
    ip: meta?.ip || "Unknown",
    asn: meta?.asn || "Unknown",
    lat: meta?.lat || "Unknown",
    lon: meta?.lon || "Unknown",
    currency: meta?.currency || "Unknown",
    languages: meta?.languages || "Unknown",
    timezone: meta?.timezone || "Unknown",
    meta_last_checked: meta?.lastChecked || 0,
    ...device
  };

  // Unify user identity in Google Analytics
  setUserId(appAnalytics, uuid);

  // Set Global User Properties
  setUserProperties(appAnalytics, {
    user_country: context.country,
    user_region: context.region,
    user_city: context.city,
    user_isp: context.isp,
    user_ip: context.ip,
    user_asn: context.asn,
    user_lat: context.lat,
    user_lon: context.lon,
    user_currency: context.currency,
    user_languages: context.languages,
    user_timezone: context.timezone,
    user_os: context.os,
    user_browser: context.browser,
    user_device: context.device,
    user_resolution: context.resolution,
    user_language_code: context.language
  });

  return context;
}

export async function logUserMetadata() {
  const context = await getUserContext();

  logEvent(appAnalytics, "user_deep_metadata", {
    ...context,
  });
}

export async function pageLogging(pageName) {
  const context = await getUserContext();

  logEvent(appAnalytics, "page_view", {
    page: pageName,
    ...context,
  });
}

export async function clickLogging(itemName) {
  const context = await getUserContext();

  logEvent(appAnalytics, "click", {
    item: itemName,
    ...context,
  });
}

export async function clipboardLogging(clipCode, clipAction) {
  const context = await getUserContext();

  logEvent(appAnalytics, "clipboard", {
    code: clipCode,
    action: clipAction ? "Created" : "Joined",
    ...context,
  });
}