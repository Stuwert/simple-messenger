import pusher from "../pusherInstance";
import { User } from "./types";
export default async function notifyUserOfIncomingCall(
  userToContact: User,
  userMakingRequest: User,
  roomId: string
): Promise<void> {
  try {
    await pusher.trigger(userToContact.privateId, "incoming-call", {
      roomId,
      publicId: userMakingRequest.publicId,
      username: userMakingRequest.username,
    });
  } catch (error) {
    console.log("something failed");
    console.error(error);
  }
}
