import { ConnectionDetails } from "../Lobby/NewChat";
import { CHAT_RECORDS } from "./localStorageValues";

export default function getConnectionDetails(
  publicId: string
): ConnectionDetails {
  const allUsersString = localStorage.getItem(CHAT_RECORDS);

  if (allUsersString) {
    const allUsers: ConnectionDetails[] = JSON.parse(allUsersString);

    const foundUser = allUsers.find(({ publicId: userId }) => {
      if (publicId === userId) return true;
      return false;
    });

    if (foundUser) {
      return foundUser;
    }
  }

  throw new Error("Tried to access chat before loading user or chat");
}
