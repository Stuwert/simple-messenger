import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { Redirect } from "react-router";
import pusher from "../utilities/pusherInstance";
import { ConnectionDetails } from "./NewChat";

export default function IncomingChat({
  privateId,
  addNewRoom,
}: {
  privateId: string;
  addNewRoom: Function;
}) {
  const [isModalVisible, updateModalVisibility] = useState(false);
  const setModalVisible = () => updateModalVisibility(true);
  const setModalInvisible = () => updateModalVisibility(false);

  const [userRequestingConnection, setUserRequestingConnection] =
    useState<ConnectionDetails | undefined>(undefined);

  const [hasAcceptedConnection, updateConnectionAcceptance] = useState(false);

  // Opportunity for abstraction
  const startNewChat = () => {
    updateConnectionAcceptance(true);
    addNewRoom(userRequestingConnection);
  };

  const declineChat = () => {
    setModalInvisible();
    setUserRequestingConnection(undefined);
  };

  useEffect(() => {
    const privateChannel = pusher.subscribe(privateId);

    console.log(privateChannel.subscribed);

    privateChannel.bind("incoming-call", (message: ConnectionDetails) => {
      console.log(message);

      setModalVisible();
      setUserRequestingConnection(message);
    });
  });

  if (hasAcceptedConnection) {
    return <Redirect to={`/chat/${userRequestingConnection?.publicId}`} />;
  }

  return (
    <>
      <Modal
        title="Chat New User"
        onOk={startNewChat}
        onCancel={declineChat}
        visible={isModalVisible}
      >
        <p>{userRequestingConnection?.username} would like to chat with you!</p>
      </Modal>
    </>
  );
}
