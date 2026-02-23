import { useEffect } from "react";
import { userIdentifier, userMetadata } from "../scripts/userIdentifier";

function UserIdentification() {
  useEffect(() => {
    userIdentifier();
  }, []);

  useEffect(() => {
  userMetadata().then(meta => {
  });
}, []);

  return null;
}

export default UserIdentification;
