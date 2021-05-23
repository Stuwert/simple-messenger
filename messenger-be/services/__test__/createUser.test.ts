import createUser, {
  generatePrivateKey,
  generateUserNumber,
} from "../createUser";

describe("createUser", () => {
  describe("default function", () => {
    it("Should generate a new user", async () => {
      const user = await createUser();

      expect(user.username).not.toBeNull();
      expect(user.publicId).not.toBeNull();
      expect(user.privateId).not.toBeNull();
    });

    it.skip("Should error if the public key already exists", async () => {
      /**
       * Given the size of this test it seems a bit silly to run.
       *
       * But it's a look at how I'd approacch validating that the function
       * won't return duplicates.
       */

      let errorMessage = "";
      try {
        await new Array(1000000).fill("").reduce(async (prevPromise) => {
          await prevPromise;

          return createUser();
        }, Promise.resolve());
      } catch ({ message }) {
        errorMessage = message;
      }

      expect(errorMessage).toBe(
        'insert into "users" ("private_id", "public_id", "username") values ($1, $2, $3) returning "id", "public_id", "private_id" - duplicate key value violates unique constraint "users_public_id_unique"'
      );
    });

    it("should generate different users", async () => {
      const userOne = await createUser();
      const userTwo = await createUser();

      expect(userOne.publicId).not.toEqual(userTwo.publicId);
      expect(userOne.privateId).not.toEqual(userTwo.privateId);
    });
  });

  describe("generatePrivateKey", () => {
    it("Should create different private keys for the same userNumber based on time", async () => {
      const asyncTimeout = (timeOut: number) =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve("");
          }, timeOut);
        });
      const user = "bingbong";

      const privateKeyOne = generatePrivateKey(user);
      await asyncTimeout(1000);
      const privateKeyTwo = generatePrivateKey(user);

      expect(privateKeyOne).not.toEqual(privateKeyTwo);
    });
  });

  describe("generateUserNumber", () => {
    it("Should be composed of a XXX-XXX pattern", () => {
      const userNumber = generateUserNumber();

      const result = userNumber.match(/[0-9]{3}-[0-9]{3}/g);

      expect(result).not.toBeNull();
    });
  });
});
