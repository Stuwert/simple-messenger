import { getUserStorageLocation, USER_PREFIX } from "../localStorageValues";

describe("localStorageValues", () => {
  describe("the function getUserStorageLocation", () => {
    it("should return the correctly prefixed user id", () => {
      const result = getUserStorageLocation("bingbong");

      expect(result).toBe(`${USER_PREFIX}_bingbong`);
    });
  });
});
