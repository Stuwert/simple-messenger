import pusher from "../pusherInstance";
import { User } from "./types";
export default async function notifyUserOfIncomingCall(
  userToContact: User,
  userMakingRequest: User
): Promise<void> {
  console.log("makes it to pusher");
  console.log(userToContact.privateId);
  try {
    await pusher.trigger(userToContact.privateId, "incoming-call", {
      publicId: userMakingRequest.publicId,
      username: userMakingRequest.username,
    });
  } catch (error) {
    console.log("something failed");
    console.error(error);
  }
}
