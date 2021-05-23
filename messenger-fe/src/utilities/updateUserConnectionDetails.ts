import { CHAT_RECORDS } from "./localStorageValues";
import { UserDetails } from "../Lobby/useSetUser";

export default function updateUserConnectionDetails(
  publicId: string,
  newUsername: string
) {
  const stringifiedUserDetails = localStorage.getItem(CHAT_RECORDS);

  if (!stringifiedUserDetails) {
    throw new Error("No Stringified User Details");
  }

  const newUserDetails = JSON.parse(stringifiedUserDetails).map(
    (userDetails: UserDetails) => {
      if (publicId === userDetails.publicId) {
        return {
          ...userDetails,
          username: newUsername,
        };
      }

      return userDetails;
    }
  );

  localStorage.setItem(CHAT_RECORDS, JSON.stringify(newUserDetails));
}
