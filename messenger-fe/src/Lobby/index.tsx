import { Button, Card, Input, PageHeader, Space } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import NewChat, { ConnectionDetails } from "./NewChat";
import useSetUser from "../utilities/useSetUser";
import usePusher from "../utilities/usePusher";

// list out available chats
// start a new chat
// const baseChats = [{ userName: "bingBong", publicId: '123-456' }, { userName: 'singalong', publicId: '654-321'}]'

export default function Lobby() {
  const [availableRooms, updateAvailableRooms] = useState<ConnectionDetails[]>(
    []
  );

  const addNewRoom = (newRoom: ConnectionDetails): void => {
    updateAvailableRooms([...availableRooms, newRoom]);
  };

  // const [userName, setUserName] = useState<string | undefined>(undefined);

  const userDetails = useSetUser();
  const pusherInstance = usePusher(userDetails?.privateId);

  console.log({ userDetails });
  console.log(pusherInstance);

  /**
   * Manages the rooms we're connected to
   */
  useEffect(() => {
    const stringifiedRooms = localStorage.getItem("simple_messenger_app_chats");

    if (stringifiedRooms) {
      updateAvailableRooms(JSON.parse(stringifiedRooms));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "simple_messenger_app_chats",
      JSON.stringify(availableRooms)
    );
  }, [availableRooms]);

  // /**
  //  * Manages our user id
  //  */
  // useEffect(() => {
  //   const userName = localStorage.getItem("simple_messenger_private_id");
  //   console.log({ userName });

  //   setUserName(userName || "");
  // }, []);

  // console.log({ userName });

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader title={`Welcome ${userDetails.username}`}>
        Other Users Can Reach You At: {userDetails.publicId}
      </PageHeader>
      <Content>
        <NewChat addNewRoom={addNewRoom} />
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
      </Content>
    </>
  );
}
