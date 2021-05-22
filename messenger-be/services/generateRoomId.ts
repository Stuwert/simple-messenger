import CryptoJS from "crypto-js";

import knex from "../knexInstance";
import { User } from "./types";

const SECRET_KEY = "SUPERSECRETKEY";

// privatekey string
// user number string
// returns a room

// the goal of returning a random hash is that we won't allow people to discern potential numbers
// I suppose this isn't actually much of a problem in the sense that

/// UGGGGGH IVE MADE THIS WAY TOO COMPLEX

// the main benefit of a server is to not duplicate records
// so that you can talk to multiple different people with different numbers

// Not store data
// orchestrate connection between different people in as light a weight way as possible
// Not do things like user authentication
// so and so is "messaging" you

// I decided not to use private channels in Pusher because it seemed explicitly outside the scope of the
// I picked a secret key because it's not "authentication" and also nods at some level of "spoofing"

/**
 * Top level goal here was to:
 *
 * 1. build a server that could manage multiple connections between different people.
 * 2. Allow users to see who's messaging them
 * 3. Not store message data on the server but use it to orchestrate connections
 * 4. Add tests
 *
 *
 */
export async function fetchUserFromPublicKey(
  publicIdContactUser: string
): Promise<User> {
  const [user] = await knex("users").select("*").where({
    public_id: publicIdContactUser,
  });

  if (!user) {
    return {
      username: "",
      privateId: Math.random().toString().slice(2, 10),
      publicId: publicIdContactUser,
    };
  }

  return {
    username: user.username,
    privateId: user.private_id,
    publicId: user.public_id,
  };
}

export async function fetchUserFromPrivateKey(
  privateIdRequestUser: string
): Promise<User> {
  const [user] = await knex("users").select("*").where({
    private_id: privateIdRequestUser,
  });

  if (!user) {
    throw new Error("Cannot request user that does not exist");
  }

  return {
    username: user.username,
    privateId: user.private_id,
    publicId: user.public_id,
  };
}

export default async function generateRoomId(
  privateIdRequestUser: string,
  publicIdContactUser: string
): Promise<{
  userToContact: User;
  userMakingRequest: User;
  roomId: string;
}> {
  const userMakingRequest = await fetchUserFromPrivateKey(privateIdRequestUser);
  const userToContact = await fetchUserFromPublicKey(publicIdContactUser);
  /**
   * This is a nod towards making it
   * impossible for people to sit in on a conversation
   * just by knowing/testing two sets of public numbers.
   */

  if (privateIdRequestUser === userToContact.privateId) {
    throw new Error("Cannot generate a room with yourself");
  }

  const arrayOfIds = [privateIdRequestUser, userToContact.privateId];

  /**
   * We want to sort these here so regardless
   * who the requestor is we'll always generate the same room value
   */
  const idString = arrayOfIds.sort((a, b) => a.localeCompare(b)).join("");

  const hashString = CryptoJS.SHA1(idString).toString(CryptoJS.enc.Hex);

  console.log(hashString);
  // Because this never needs to be decrypted, we should be fine with this
  return {
    userToContact,
    userMakingRequest,
    roomId: hashString,
  };
}
