import { useState, useEffect } from "react";
import pusher from "../utilities/pusherInstance";
import getConnectionDetails from "../utilities/getConnectionDetails";
import { getUserStorageLocation } from "../utilities/localStorageValues";
import axios from "axios";

export interface MessageDetails {
  username: string;
  message: string;
  sentAt?: string;
}

export default function useChat(
  publicId: string,
  me: string
): [MessageDetails[], Function] {
  const storageLocation = getUserStorageLocation(publicId);
  const { roomId } = getConnectionDetails(publicId);

  const [messageToAddToLocal, addMessageToQueue] =
    useState<MessageDetails | undefined>(undefined);
  const [messages, setMessages] = useState<MessageDetails[]>([]);
  const [messageToSend, setMessagetoSend] =
    useState<MessageDetails | undefined>(undefined);

  /**
   * Manages the localstorage we're connected to
   */
  useEffect(() => {
    const chat = localStorage.getItem(getUserStorageLocation(publicId));

    if (chat) {
      setMessages(JSON.parse(chat));
    }
  }, [publicId]);

  useEffect(() => {
    localStorage.setItem(storageLocation, JSON.stringify(messages));
  }, [messages, storageLocation]);

  useEffect(() => {
    const roomChannel = pusher.subscribe(roomId);
    roomChannel.bind("message", (message: MessageDetails) => {
      if (message.username !== me) {
        // theoretically we would add the logic here
        // to update the username if we don't have it

        addMessageToQueue(message);
      }
    });

    return () => {
      pusher.unsubscribe(roomId);
    };
  }, [roomId, me]);

  useEffect(() => {
    if (messageToSend) {
      axios.post(`/rooms/${roomId}/message`, messageToSend);

      addMessageToQueue(messageToSend);
      setMessagetoSend(undefined);
    }
  }, [messageToSend, roomId]);

  useEffect(() => {
    if (messageToAddToLocal) {
      setMessages([...messages, messageToAddToLocal]);
      addMessageToQueue(undefined);
    }
  }, [messages, messageToAddToLocal]);

  return [messages, setMessagetoSend];
}
