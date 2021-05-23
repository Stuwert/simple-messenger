import createUser from "../createUser";
import generateRoomId, {
  fetchUserFromPrivateKey,
  fetchUserFromPublicKey,
} from "../generateRoomId";
import { User } from "../types";

describe("generateRoomId File", () => {
  let userOne: User;
  let userTwo: User;

  beforeEach(async () => {
    userOne = await createUser();
    userTwo = await createUser();
  });

  describe("default function", () => {
    it("Should return the same room id regardless of order", async () => {
      const roomOne = await generateRoomId(userOne.privateId, userTwo.publicId);
      const roomTwo = await generateRoomId(userTwo.privateId, userOne.publicId);

      expect(roomOne.roomId).toEqual(roomTwo.roomId);
    });

    it("Should generate a room even if the user to be contacted does not exist", async () => {
      const room = await generateRoomId(userOne.privateId, "");

      expect(room.roomId).not.toBeNull();
    });

    it("Should error if the requesting user does not exist", async () => {
      await expect(generateRoomId("", userOne.publicId)).rejects.toThrow(
        new Error("Cannot request user that does not exist")
      );
    });
  });

  describe("fetchUserFromPrivateKey", () => {
    it("Should fetch the correct user from the private id", async () => {
      const foundUser = await fetchUserFromPrivateKey(userOne.privateId);

      expect(foundUser).toEqual(userOne);
    });
  });

  describe("fetchUserFromPublicKey", () => {
    it("Should fetch the correct user from the public key", async () => {
      const foundUser = await fetchUserFromPublicKey(userTwo.publicId);

      expect(foundUser).toEqual(userTwo);
    });
  });
});
