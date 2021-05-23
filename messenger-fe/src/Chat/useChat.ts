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

  /**
   * I added a queue step here so that the pusher
   * useEffects wouldn't have to know about the existence of
   * all of the messages and so wouldn't retrigger.
   * This might be overarchitected though, and is likely
   * a good spot for refactor.
   */
  const [messageToAddToLocal, addMessageToQueue] =
    useState<MessageDetails | undefined>(undefined);
  /**
   * Manages overall message state
   */
  const [messages, setMessages] = useState<MessageDetails[]>([]);
  /**
   * Handles the state of the message we're about to send
   * and is our main point of communication with the react component.
   */
  const [messageToSend, setMessagetoSend] =
    useState<MessageDetails | undefined>(undefined);

  /**
   * Loads existing chats from local storage
   */
  useEffect(() => {
    const chat = localStorage.getItem(getUserStorageLocation(publicId));

    if (chat) {
      setMessages(JSON.parse(chat));
    }
  }, [publicId]);

  /**
   * saves new chats to local storage
   */
  useEffect(() => {
    localStorage.setItem(storageLocation, JSON.stringify(messages));
  }, [messages, storageLocation]);

  /**
   * Handles subscription and un-subscription to Pusher Channel
   * Updates our messages when we receive a new event that's
   * not from us.
   */
  useEffect(() => {
    const roomChannel = pusher.subscribe(roomId);
    roomChannel.bind("message", (message: MessageDetails) => {
      /**
       * Comparing usernames is super naive
       * but should be good enough for now
       */
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

  /**
   * Handles the post request to send a message
   * we want to fire off
   */
  useEffect(() => {
    if (messageToSend) {
      axios.post(
        `${process.env.REACT_APP_API_URL}/rooms/${roomId}/message`,
        messageToSend
      );

      addMessageToQueue(messageToSend);
      setMessagetoSend(undefined);
    }
  }, [messageToSend, roomId]);

  /**
   * Manages the queue so the other systems don't have to
   * Adds message we send and receive to our list of messages
   */
  useEffect(() => {
    if (messageToAddToLocal) {
      setMessages([...messages, messageToAddToLocal]);
      addMessageToQueue(undefined);
    }
  }, [messages, messageToAddToLocal]);

  return [messages, setMessagetoSend];
}
