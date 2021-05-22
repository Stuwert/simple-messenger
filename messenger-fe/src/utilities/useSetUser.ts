import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

export interface UserDetails {
  username: string;
  privateId: string;
  publicId: string;
}

export default function useSetUser(): UserDetails | undefined {
  // First it attempts to load local
  // Does the POST request
  // save deets to local storage
  // returns deets

  const [userDetails, setUserDetails] =
    useState<UserDetails | undefined>(undefined);

  console.log(process.env.REACT_APP_API_URL);

  /**
   * Manages our user id
   */
  useEffect(() => {
    const stringifiedUserDetails = localStorage.getItem(
      "simple_messenger_user_detail"
    );

    if (stringifiedUserDetails) {
      const userDetails = JSON.parse(stringifiedUserDetails);

      setUserDetails(userDetails);
    } else {
      axios
        .post("/users/create")
        .then(({ data }: AxiosResponse<UserDetails>) => {
          console.log({ data });
          localStorage.setItem(
            "simple_messenger_user_detail",
            JSON.stringify(data)
          );
          setUserDetails(data);
        });
      // make request
    }
  }, []);

  // connect to pusher

  return userDetails;
}
