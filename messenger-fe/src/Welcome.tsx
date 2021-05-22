import React, { useState } from "react";
import { Button, Col, Input, PageHeader, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import { Redirect } from "react-router";

export default function Welcome() {
  const [userName, setUserName] = useState("");
  const [userNameInput, setUserNameInput] = useState("");

  const setPrivateKey = () => {
    localStorage.setItem("simple_messenger_private_id", userNameInput);

    setUserName(userNameInput);
  };

  console.log(userName);

  if (userName) {
    return <Redirect to="/" />;
  }

  return (
    <Content>
      <PageHeader>Welcome to Simple Chat</PageHeader>
      <p>In order to continue please enter a username.</p>
      <Row>
        <Col span={22}>
          <Input
            onPressEnter={setPrivateKey}
            value={userNameInput}
            onChange={(e) => setUserNameInput(e.target.value)}
          />
        </Col>
        <Col span={2}>
          <Button onClick={setPrivateKey}>Send</Button>
        </Col>
      </Row>
    </Content>
  );
}
