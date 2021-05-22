import React, { ChangeEvent, useState } from "react";
import { Card, Button, Modal, Input } from "antd";
import { Redirect } from "react-router";
import { UserOutlined } from "@ant-design/icons";

export interface ConnectionDetails {
  username: string;
  publicId: string;
  roomId: string;
}

export default function NewChat({ addNewRoom }: { addNewRoom: Function }) {
  /**
   * Also needs to subscribe to the notification state
   * where someone pings us
   */
  const [linkToUser, setUserToLinkTo] = useState("");

  const [userIdToConnectTo, updateUserIdToConnectTo] = useState("");

  const updateUserIdFromInput = (e: ChangeEvent<HTMLInputElement>) => {
    updateUserIdToConnectTo(e.target.value);
  };

  const [isModalVisible, updateModalVisibility] = useState(false);

  const setModalVisible = () => updateModalVisibility(true);
  const setModalInvisible = () => updateModalVisibility(false);

  const createNewChat = () => {
    const userDetails: ConnectionDetails = {
      publicId: userIdToConnectTo,
      roomId: "",
      username: "", // This will be updated once we get the first message back from the user
    };

    updateModalVisibility(false);
    // Change this to
    addNewRoom(userDetails);
    setUserToLinkTo(userIdToConnectTo);
  };

  if (linkToUser !== "") {
    return <Redirect to={`/chat/${linkToUser}`} />;
  }

  return (
    <>
      <Card title="New Chat" style={{ width: 200 }}>
        <Button type="primary" onClick={setModalVisible}>
          Message New User
        </Button>
      </Card>
      <Modal
        title="Chat New User"
        onOk={createNewChat}
        onCancel={setModalInvisible}
        visible={isModalVisible}
      >
        <Input
          placeholder="XXXXXX"
          size="large"
          prefix={<UserOutlined />}
          onChange={updateUserIdFromInput}
        />
      </Modal>
    </>
  );
}
