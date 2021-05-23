import React, { ChangeEvent, useState } from "react";
import { Card, Button, Modal, Input } from "antd";
import { Redirect } from "react-router";
import { UserOutlined } from "@ant-design/icons";
import useCreateConnection from "./useCreateConnection";

/**
 *
 * This component is responsible for letting the user
 * propose a new chat with another user.
 */

export default function NewChat({
  addNewRoom,
  privateId,
}: {
  addNewRoom: Function;
  privateId: string;
}) {
  const [isModalVisible, updateModalVisibility] = useState(false);
  const setModalVisible = () => updateModalVisibility(true);
  const setModalInvisible = () => updateModalVisibility(false);

  const [publicIdString, setPublicIdString] = useState("");

  const [linkToUser, connectToNewUser] = useCreateConnection(
    addNewRoom,
    privateId
  );
  const createNewChat = () => connectToNewUser(publicIdString);

  const updateUserIdFromInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPublicIdString(e.target.value);
  };

  if (linkToUser) {
    return <Redirect to={`/chat/${linkToUser.publicId}`} />;
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
