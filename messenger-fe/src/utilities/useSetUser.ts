import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { USER_DETAILS } from "./localStorageValues";

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

  /**
   * Manages our user id
   */
  useEffect(() => {
    const stringifiedUserDetails = localStorage.getItem(USER_DETAILS);

    if (stringifiedUserDetails) {
      const userDetails = JSON.parse(stringifiedUserDetails);

      setUserDetails(userDetails);
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/users/create`)
        .then(({ data }: AxiosResponse<UserDetails>) => {
          localStorage.setItem(USER_DETAILS, JSON.stringify(data));
          setUserDetails(data);
        });
      // make request
    }
  }, []);

  // connect to pusher

  return userDetails;
}
