import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { USER_DETAILS } from "../utilities/localStorageValues";

export interface UserDetails {
  username: string;
  privateId: string;
  publicId: string;
}

/**
 *
 * This manages loading our user record
 * in as minimal effort as possible without
 * user interaction.
 *
 */

export default function useSetUser(): UserDetails | undefined {
  const [userDetails, setUserDetails] =
    useState<UserDetails | undefined>(undefined);

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
    }
  }, []);

  return userDetails;
}
