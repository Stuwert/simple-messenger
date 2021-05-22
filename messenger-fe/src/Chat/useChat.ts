import { useState, useEffect } from "react";
import pusher from "../utilities/pusherInstance";
import getConnectionDetails, {
  MessageDetails,
} from "../utilities/getConnectionDetails";
import { getUserStorageLocation } from "../utilities/localStorageValues";

export default function useChat(
  publicId: string,
  me: string
): [MessageDetails[], Function] {
  const storageLocation = getUserStorageLocation(publicId);
  const { roomId } = getConnectionDetails(publicId);

  const [messages, setMessages] = useState<MessageDetails[]>([]);
  const [messageToSend, setMessagetoSend] =
    useState<MessageDetails | undefined>(undefined);

  /**
   * Manages the chat we're connected to
   */
  useEffect(() => {
    const chat = localStorage.getItem(getUserStorageLocation(publicId));

    if (chat) {
      setMessages(JSON.parse(chat));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageLocation, JSON.stringify(messages));
  }, [messages, storageLocation]);

  useEffect(() => {
    const roomChannel = pusher.subscribe(roomId);

    if (messageToSend) {
      setMessages([...messages, messageToSend]);
      setMessagetoSend(undefined);
      roomChannel.trigger("client-message", messageToSend);
    }

    roomChannel.bind("client-message", (message: MessageDetails) => {
      if (message.username !== me) {
        setMessages([...messages, message]);
      }
    });

    return () => {
      pusher.unsubscribe(roomId);
    };
  }, [messageToSend, roomId, me, messages]);

  return [messages, setMessagetoSend];
}
