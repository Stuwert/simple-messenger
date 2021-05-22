import { Button, Card, Col, Input, PageHeader, Row } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const testData = {
  username: "bingbong",
  messages: [
    {
      username: "bingbong",
      message: "hi",
    },
    {
      username: "me",
      message: "how are you",
    },
  ],
};

/**
 * Making the assumption here that there
 * will only ever be two people in the chat
 * at a given time.
 *
 * That way we can basically care if the
 * username in the room is the same as the username
 * to determine whom it belongs to.
 */
interface MessageDetails {
  username: string;
  message: string;
  sentAt?: string;
}

interface UserChat {
  username: string;
  messages: MessageDetails[];
}

function makeNewUserChat(publicId: string): UserChat {
  const newUserChat: UserChat = {
    username: "someName",
    messages: [],
  };

  localStorage.setItem(
    `simple_messenger_app_chat_${publicId}`,
    JSON.stringify(newUserChat)
  );

  return newUserChat;
}

function updateUserChat(message: string) {
  // Tries to send the message
  // gets back a 200
  // stores in local storage
}

// Should we add an online indicator? Basically how many people are in the chat
// So basically the server will have to subscribe them to an empty room if it doesn't exist
// That's fine
// On exit make sure to unsubscribe

// Actually lol we won't know their username until they actually send it back from the API
// TODO: Figure out how to get the username back
// Actually just update it on the first subscription send

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const [currentMessages, setMessages] = useState<MessageDetails[]>([]);
  const [username, setUserName] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const potentialMessages = localStorage.getItem(
      `simple_messenger_app_chat_${id}`
    );
    console.log(id);

    console.log(potentialMessages);

    if (potentialMessages) {
      const { messages, username } = JSON.parse(potentialMessages);

      console.log(messages);
      console.log(username);

      setMessages(messages);
      setUserName(username);
    } else {
      const { messages, username } = makeNewUserChat(id);
      setMessages(messages);
      setUserName(username);
    }
  }, []);

  const addToMessages = (message: MessageDetails) => {
    const newMessages = [...currentMessages, message];

    localStorage.setItem(
      `simple_messenger_app_chat_${id}`,
      JSON.stringify({ username, messages: newMessages })
    );
    setMessages(newMessages);
  };

  const sendMessage = () => {
    setLoading(!isLoading);

    const message: MessageDetails = {
      username: "me",
      message: currentMessage,
    };

    setTimeout(() => {
      addToMessages(message);
      setLoading(false);
      setCurrentMessage("");
    }, 1000);

    /**
     * 0. Start Loading
     * 1. try to send to the api
     * 2. Validate that the confirmation
     * 3. Add to local storage
     * 4. Wipe the content
     * 5. Stop loading
     */
  };

  return (
    <>
      <PageHeader title={`Chat with ${username || id}`} />
      {currentMessages.map((message) => (
        <Row>
          <Col span={8} offset={message.username === username ? 0 : 16}>
            <Card title={message.message}>
              <p>{message.username}</p>
              <p>{message.sentAt}</p>
            </Card>
          </Col>
        </Row>
      ))}
      <Row>
        <Col span={22}>
          <Input
            onPressEnter={sendMessage}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
        </Col>
        <Col span={2}>
          <Button loading={isLoading} onClick={sendMessage}>
            Send
          </Button>
        </Col>
      </Row>
    </>
  );
  // Check if the user is in the list of default apps
  // if not, redirect back home
  // See if there's a private id loaded, if there is go get it
  // if there's not, make one.
  // Read the public id off of the route
}
