import React, { useEffect, useState } from "react";
import { Button, Card, PageHeader, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import { Link } from "react-router-dom";
import NewChat from "./NewChat";
import useSetUser from "./useSetUser";
import IncomingChat from "./IncomingChat";
import { CHAT_RECORDS } from "../utilities/localStorageValues";
import { ConnectionDetails } from "../utilities/getConnectionDetails";

/**
 *
 * The Lobby displays all of the chats we've saved in local storage
 * and also gives us the opportunity to start a new chat.
 */

export default function Lobby() {
  /**
   * If we've never connected to the app before, this will generate a new
   * set of userDetails via the API and store it to localstorage.
   * If we have connected to the app before, this will return the userDetails
   * stored there.
   */
  const userDetails = useSetUser();

  const [availableRooms, updateAvailableRooms] = useState<ConnectionDetails[]>(
    []
  );

  const addNewRoom = (newRoom: ConnectionDetails): void => {
    updateAvailableRooms([...availableRooms, newRoom]);
  };

  /**
   * These use effects save and retrieve our index of chats.
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
        <Row>
          {availableRooms.map(({ username, publicId }, idx: number) => (
            <Card title={username || publicId} style={{ width: 250 }} key={idx}>
              <Button type="primary">
                <Link to={`/chat/${publicId}`}>Chat</Link>
              </Button>
            </Card>
          ))}
        </Row>
      </Content>
    </>
  );
}
