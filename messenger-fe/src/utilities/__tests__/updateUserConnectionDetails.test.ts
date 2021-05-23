import { USER_DETAILS } from "../localStorageValues";
import updateUserConnectionDetails from "../updateUserConnectionDetails";
import { UserDetails } from "../../Lobby/useSetUser";

function getUsersFromLocalStorageOrError() {
  const stringifiedUsers = localStorage.getItem(USER_DETAILS);

  if (!stringifiedUsers) {
    throw new Error("Expected users but none exist");
  }

  const users = JSON.parse(stringifiedUsers);

  return users;
}

describe("updateUserConnectionDetails", () => {
  const userDetailsArray = [
    {
      username: "bingbong",
      publicId: "singalong",
      roomId: "algore",
    },
    {
      username: "someone",
      publicId: "else",
      roomId: "here",
    },
  ];

  beforeEach(() => {
    localStorage.setItem(USER_DETAILS, JSON.stringify(userDetailsArray));
  });

  it("should error if no user details are stored", () => {
    localStorage.setItem(USER_DETAILS, "");

    let errorMessage = "";

    try {
      updateUserConnectionDetails("singalong", "anger");
    } catch ({ message }) {
      errorMessage = message;
    }

    expect(errorMessage).toEqual("No Stringified User Details");
  });

  it("Should update the user details if they exist", () => {
    updateUserConnectionDetails("singalong", "anger");

    const users = getUsersFromLocalStorageOrError();

    const userDetails = users.find(
      ({ publicId }: UserDetails) => publicId === "singalong"
    );

    expect(userDetails.username).toBe("anger");
  });

  it("Shoult not update user details if they do not exist", () => {
    updateUserConnectionDetails("notinthere", "stillnnotthere");

    const users = getUsersFromLocalStorageOrError();

    expect(users).toEqual(userDetailsArray);
  });
});
