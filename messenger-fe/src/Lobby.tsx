import { Button, Card, Input, PageHeader, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import Modal from "antd/lib/modal/Modal";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
const { Search } = Input;
// list out available chats
// start a new chat
// const baseChats = [{ userName: "bingBong", publicId: '123-456' }, { userName: 'singalong', publicId: '654-321'}]'

interface ConnectionDetails {
  userName: string;
  publicId: string;
}

export default function Lobby() {
  const [availableRooms, updateAvailableRooms] = useState<ConnectionDetails[]>(
    []
  );
  const [isModalVisible, updateModalVisibility] = useState(false);
  const [userIdToConnectTo, updateUserIdToConnectTo] = useState("");
  const [linkToUser, setUserToLinkTo] = useState("");

  const setModalVisible = () => updateModalVisibility(true);
  const setModalInvisible = () => updateModalVisibility(false);
  const createNewChat = () => {
    const userDetails: ConnectionDetails = {
      publicId: userIdToConnectTo,
      userName: "", // This will be updated once we get the first message back from the user
    };

    // This is where we actually connect to the

    const newAvailableRooms = [...availableRooms, userDetails];

    localStorage.setItem(
      "simple_messenger_app_chats",
      JSON.stringify(newAvailableRooms)
    );
    updateModalVisibility(false);
    updateAvailableRooms(newAvailableRooms);
    setUserToLinkTo(userIdToConnectTo);
  };

  const updateUserIdFromInput = (e: ChangeEvent<HTMLInputElement>) => {
    updateUserIdToConnectTo(e.target.value);
  };

  useEffect(() => {
    const stringifiedRooms = localStorage.getItem("simple_messenger_app_chats");

    if (stringifiedRooms) {
      updateAvailableRooms(JSON.parse(stringifiedRooms));
    }
  }, []);

  if (linkToUser !== "") {
    return <Redirect to={`/chat/${linkToUser}`} />;
  }

  return (
    <Content>
      <PageHeader title="Lobby" />
      <Space direction="vertical">
        {availableRooms.map(({ userName, publicId }) => (
          <Card
            title={`Chat with ${userName || publicId}`}
            style={{ width: 200 }}
          >
            <Button type="primary">
              <Link to={`/chat/${publicId}`}>Connect</Link>
            </Button>
          </Card>
        ))}
      </Space>
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
          placeholder="XXX-XXX"
          size="large"
          prefix={<UserOutlined />}
          onChange={updateUserIdFromInput}
        />
      </Modal>
    </Content>
  );
}
