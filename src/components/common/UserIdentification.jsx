import { useEffect } from "react";
import { userIdentifier } from "../../utils/userIdentifier";
import { logUserMetadata } from "../../services/analyticsService";

function UserIdentification() {
  useEffect(() => {
    userIdentifier();
    logUserMetadata();
  }, []);

  return null;
}

export default UserIdentification;
