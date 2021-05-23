import pusher from "../pusherInstance";
import { User } from "./types";
export default async function sendMessageToRoom(
  roomId: string,
  message: any // setting as any b/c passthru
): Promise<void> {
  try {
    await pusher.trigger(roomId, "message", message);
  } catch (error) {
    console.log("something failed");
    console.error(error);
  }
}
