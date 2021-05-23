import CryptoJS from "crypto-js";
import knex from "../knexInstance";
import { User } from "./types";

const randomWord = require("random-word");

const SECRET_KEY = "BING_BONG";

export function generateUserNumber(): string {
  /**
   * This is going to assume for the time being
   * that there won't be enough use to see conflicts
   * so... we're going to naively insert
   *
   * In a future iteration this would ideally check
   * to see if a number had already been generated for
   * that user.
   */
  const firstThree = Math.random().toString().slice(2, 5);
  const lastThree = Math.random().toString().slice(2, 5);

  return `${firstThree}-${lastThree}`;
}

export function generatePrivateKey(userNumber: string): string {
  const date = new Date().toString;

  return CryptoJS.SHA1(`${userNumber}${date}${SECRET_KEY}`).toString(
    CryptoJS.enc.Hex
  );
}

export default async function (): Promise<User> {
  const newUserNumber = generateUserNumber();

  const username = `${randomWord()} ${randomWord()}`;

  const [user] = await knex("users")
    .returning(["id", "public_id", "private_id"])
    .insert({
      username,
      public_id: newUserNumber,
      private_id: generatePrivateKey(newUserNumber),
    });

  return {
    username,
    publicId: user.public_id,
    privateId: user.private_id,
  };
}
