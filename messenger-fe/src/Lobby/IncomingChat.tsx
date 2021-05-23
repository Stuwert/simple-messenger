import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { Redirect } from "react-router";
import pusher from "../utilities/pusherInstance";
import { ConnectionDetails } from "../utilities/getConnectionDetails";

/**
 *
 * The purpose of this component is to manage listening for
 * incoming Pusher notifications and popping up a modal
 * when we receive a new one.
 *
 * In order to do so it subscribes us to a channel based on our private key.
 *
 * Throwing around a private key like this is not great, but I'm trying to
 * nod at a unique channel without going too deep down a rabbit hole of
 * managing keys.
 *
 */

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

    privateChannel.bind("incoming-call", (message: ConnectionDetails) => {
      setModalVisible();
      setUserRequestingConnection(message);
    });

    return () => {
      pusher.unsubscribe(privateId);
    };
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
