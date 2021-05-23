import { USER_DETAILS } from "./localStorageValues";
import { UserDetails } from "./useSetUser";

export default function updateUserConnectionDetails(
  publicId: string,
  newUsername: string
) {
  const stringifiedUserDetails = localStorage.getItem(USER_DETAILS);

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

  localStorage.setItem(USER_DETAILS, JSON.stringify(newUserDetails));
}
