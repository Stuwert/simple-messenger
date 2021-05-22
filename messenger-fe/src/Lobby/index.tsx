import { Button, Card, Input, PageHeader, Space } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import NewChat, { ConnectionDetails } from "./NewChat";
import useSetUser from "../utilities/useSetUser";
import usePusher from "../utilities/pusherInstance";
import IncomingChat from "./IncomingChat";
import { CHAT_RECORDS, USER_DETAILS } from "../utilities/localStorageValues";

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

  console.log({ userDetails });

  /**
   * Manages the rooms we're connected to
   */
  useEffect(() => {
    const stringifiedRooms = localStorage.getItem(CHAT_RECORDS);

    console.log(stringifiedRooms);

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

  console.log(availableRooms);

  return (
    <>
      <PageHeader title={`Welcome ${userDetails.username}`}>
        Other Users Can Reach You At: {userDetails.publicId}
      </PageHeader>
      <Content>
        <NewChat addNewRoom={addNewRoom} />
        <IncomingChat
          addNewRoom={addNewRoom}
          privateId={userDetails.privateId}
        />
        <Space direction="vertical">
          {availableRooms.map(({ username, publicId }) => (
            <Card
              title={`Chat with ${username || publicId}`}
              style={{ width: 200 }}
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
