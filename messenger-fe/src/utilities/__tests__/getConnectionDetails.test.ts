import getConnectionDetails from "../getConnectionDetails";
import { CHAT_RECORDS } from "../localStorageValues";

describe("getConnectionDetails", () => {
  beforeEach(() => {
    localStorage.setItem(
      CHAT_RECORDS,
      JSON.stringify([
        { username: "bingbong", publicId: "singalong", roomId: "algore" },
      ])
    );
  });
  it("should error if nothing is loaded into local storage", () => {
    localStorage.setItem(CHAT_RECORDS, "");
    const randomString = Math.random().toString().slice(2, 8);
    let errorMessage = "";

    try {
      getConnectionDetails(randomString);
    } catch ({ message }) {
      errorMessage = message;
    }

    expect(errorMessage).toEqual(
      "Tried to access chat before loading user or chat"
    );
  });

  it("should error if the correct user is not loaded into local storage", () => {
    let errorMessage = "";

    try {
      getConnectionDetails("notbingbong");
    } catch ({ message }) {
      errorMessage = message;
    }

    expect(errorMessage).toEqual(
      "Tried to access chat before loading user or chat"
    );
  });

  it("should return the user if it is in local storage", () => {
    const result = getConnectionDetails("singalong");

    expect(result.username).toBe("bingbong");
    expect(result.publicId).toBe("singalong");
    expect(result.roomId).toBe("algore");
  });
});
