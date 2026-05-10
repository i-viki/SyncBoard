import { useEffect } from "react";
import { userIdentifier } from "../../utils/userIdentifier";
import { logUserMetadata } from "../../services/analyticsService";
import { ensureAnonymousAuth } from "../../services/authService";

function UserIdentification() {
  useEffect(() => {
    userIdentifier();
    logUserMetadata();
    ensureAnonymousAuth().catch(() => {
      // Silently fallback — localStorage UUID still works
    });
  }, []);

  return null;
}

export default UserIdentification;

