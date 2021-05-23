import React, { useEffect, useState } from "react";
import { Button, Card, Col, Input, PageHeader, Row } from "antd";
import { useParams } from "react-router";
import { USER_DETAILS } from "../utilities/localStorageValues";
import getConnectionDetails from "../utilities/getConnectionDetails";
import useChat, { MessageDetails } from "./useChat";
import updateUserConnectionDetails from "../utilities/updateUserConnectionDetails";

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const chatUser = getConnectionDetails(id);

  /**
   * TODO: Add handling for the edge case
   * where we try to access a user chat directly
   * but don't have them saved the user details localstorage.
   * Should probably redirect.
   */

  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageInProgress, setMessageInProgress] = useState("");
  const [chatUsername, setChatUsername] = useState(chatUser.username);

  const myUser = localStorage.getItem(USER_DETAILS);

  if (!myUser) {
    throw new Error("Should not reach state");
  }

  const { username: me } = JSON.parse(myUser);

  const [messages, sendMessageToChat] = useChat(id, me);

  /**
   * This checks messages to see if we've received one
   * from a user we initiated the chat with,
   * and reads off their username and updates our instance with their name.
   */
  useEffect(() => {
    const messageNotFromMe = messages.find(
      ({ username: messageUsername }: MessageDetails) => messageUsername !== me
    );

    if (!chatUsername && messageNotFromMe) {
      updateUserConnectionDetails(chatUser.publicId, messageNotFromMe.username);
      setChatUsername(messageNotFromMe.username);
    }
  }, [chatUsername, messages, me, chatUser.publicId]);

  /**
   * Orchestrates the relationship between our Input component
   * and actually sending the message to the API.
   */
  const sendMessage = async () => {
    setSendingMessage(true);

    const message: MessageDetails = {
      username: me,
      message: messageInProgress,
    };

    sendMessageToChat(message);
    setSendingMessage(false);
    setMessageInProgress("");
  };

  return (
    <>
      <PageHeader title={`Chat with ${chatUsername || chatUser.publicId}`} />
      {messages.map((message: MessageDetails, idx: number) => (
        <Row key={idx}>
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
            value={messageInProgress}
            onChange={(e) => setMessageInProgress(e.target.value)}
          />
        </Col>
        <Col span={2}>
          <Button loading={sendingMessage} onClick={sendMessage}>
            Send
          </Button>
        </Col>
      </Row>
    </>
  );
}
