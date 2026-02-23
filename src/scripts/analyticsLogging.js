import { logEvent } from "firebase/analytics";
import { appAnalytics } from "../firebase/config";
import { userIdentifier, userMetadata } from "./userIdentifier";

async function getUserContext() {
  const uuid = userIdentifier();
  const meta = await userMetadata();

  return {
    uuid,
    country: meta?.country || "Unknown",
  };
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