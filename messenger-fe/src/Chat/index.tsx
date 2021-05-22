import { Button, Card, Col, Input, PageHeader, Row } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  getUserStorageLocation,
  USER_DETAILS,
} from "../utilities/localStorageValues";
import getConnectionDetails, {
  MessageDetails,
} from "../utilities/getConnectionDetails";
import pusher from "../utilities/pusherInstance";
import useChat from "./useChat";

/**
 * Making the assumption here that there
 * will only ever be two people in the chat
 * at a given time.
 *
 * That way we can basically care if the
 * username in the room is the same as the username
 * to determine whom it belongs to.
 */

function updateUserChat(message: string) {
  // Tries to send the message
  // gets back a 200
  // stores in local storage
}

// Should we add an online indicator? Basically how many people are in the chat
// So basically the server will have to subscribe them to an empty room if it doesn't exist
// That's fine
// On exit make sure to unsubscribe

// Actually lol we won't know their username until they actually send it back from the API
// TODO: Figure out how to get the username back
// Actually just update it on the first subscription send

export default function Chat() {
  const { id } = useParams<{ id: string }>();

  const [isLoading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const myUser = localStorage.getItem(USER_DETAILS);

  if (!myUser) {
    throw new Error("Should not reach state");
  }
  const { username: me } = JSON.parse(myUser);
  const chatUser = getConnectionDetails(id);

  const [messages, sendMessageToChat] = useChat(id, me);

  const sendMessage = async () => {
    setLoading(true);

    const message: MessageDetails = {
      username: me,
      message: currentMessage,
    };

    sendMessageToChat(message);
    setLoading(false);
    setCurrentMessage("");
  };

  return (
    <>
      <PageHeader
        title={`Chat with ${chatUser.username || chatUser.publicId}`}
      />
      {messages.map((message: MessageDetails) => (
        <Row>
          <Col span={8} offset={message.username !== me ? 0 : 16}>
            <Card title={message.message}>
              <p>{message.username}</p>
              <p>{message.sentAt}</p>
            </Card>
          </Col>
        </Row>
      ))}
      <Row>
        <Col span={22}>
          <Input
            onPressEnter={sendMessage}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
        </Col>
        <Col span={2}>
          <Button loading={isLoading} onClick={sendMessage}>
            Send
          </Button>
        </Col>
      </Row>
    </>
  );
  // Check if the user is in the list of default apps
  // if not, redirect back home
  // See if there's a private id loaded, if there is go get it
  // if there's not, make one.
  // Read the public id off of the route
}
