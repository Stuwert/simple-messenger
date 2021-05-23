import { Button, Card, PageHeader, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewChat, { ConnectionDetails } from "./NewChat";
import useSetUser from "../utilities/useSetUser";
import IncomingChat from "./IncomingChat";
import { CHAT_RECORDS } from "../utilities/localStorageValues";

// list out available chats
// start a new chat
// const baseChats = [{ username: "bingBong", publicId: '123-456' }, { username: 'singalong', publicId: '654-321'}]'

export default function Lobby() {
  const [availableRooms, updateAvailableRooms] = useState<ConnectionDetails[]>(
    []
  );

  const addNewRoom = (newRoom: ConnectionDetails): void => {
    updateAvailableRooms([...availableRooms, newRoom]);
  };

  // const [username, setUserName] = useState<string | undefined>(undefined);

  const userDetails = useSetUser();

  /**
   * Manages the rooms we're connected to
   */
  useEffect(() => {
    const stringifiedRooms = localStorage.getItem(CHAT_RECORDS);

    if (stringifiedRooms) {
      updateAvailableRooms(JSON.parse(stringifiedRooms));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CHAT_RECORDS, JSON.stringify(availableRooms));
  }, [availableRooms]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader title={`Welcome ${userDetails.username}`}>
        Other Users Can Reach You At: {userDetails.publicId}
      </PageHeader>
      <Content>
        <NewChat addNewRoom={addNewRoom} privateId={userDetails.privateId} />
        <IncomingChat
          addNewRoom={addNewRoom}
          privateId={userDetails.privateId}
        />
        <Space direction="vertical">
          {availableRooms.map(({ username, publicId }, idx: number) => (
            <Card
              title={`Chat with ${username || publicId}`}
              style={{ width: 200 }}
              key={idx}
            >
              <Button type="primary">
                <Link to={`/chat/${publicId}`}>Connect</Link>
              </Button>
            </Card>
          ))}
        </Space>
      </Content>
    </>
  );
}
