import { useState, useEffect } from "react";
import axios from "axios";
import { ConnectionDetails } from "../utilities/getConnectionDetails";
import { CHAT_RECORDS } from "../utilities/localStorageValues";

/**
 *
 * This manages the state of
 * creating a new connection:
 *
 * - talking to the server
 * - storing the room id in local storage
 *
 */

export default function useCreateConnection(
  addNewRoom: Function,
  privateId: string
): [ConnectionDetails | undefined, Function] {
  const [linkToUser, setUserToLinkTo] =
    useState<ConnectionDetails | undefined>();
  const [publicIdToConnectTo, setPublicIdToConnectTo] = useState("");

  useEffect(() => {
    if (publicIdToConnectTo) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/users/${publicIdToConnectTo}/connect`,
          {
            privateId,
          }
        )
        .then(({ data }) => {
          const userDetails: ConnectionDetails = {
            publicId: publicIdToConnectTo,
            roomId: data,
            username: "", // This will be updated once we get the first message back from the user
          };

          const stringifiedUsers = localStorage.getItem(CHAT_RECORDS);
          const users = JSON.parse(stringifiedUsers!);
          localStorage.setItem(
            CHAT_RECORDS,
            JSON.stringify([...users, userDetails])
          );

          setUserToLinkTo(userDetails);
        });
    }
  }, [publicIdToConnectTo, addNewRoom, privateId]);

  return [linkToUser, setPublicIdToConnectTo];
}
