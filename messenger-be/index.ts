import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

require("dotenv").config();

import createUser from "./services/createUser";
import generateRoomId from "./services/generateRoomId";
import notifyUserOfIncomingCall from "./services/notifyUserOfIncomingCall";
import sendMessageToRoom from "./services/sendMessageToRoom";

const app = express();
var jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors());

app.get("/", (req, res) => {
  res.send("it works");
});

app.post("/users/create", async (req, res) => {
  const user = await createUser();
  // send a user name
  // assigns a number and a private key
  // returns the private key back

  res.status(200).send(user);
});

app.post("/users/:user_id/connect", async (req, res) => {
  const { userToContact, roomId, userMakingRequest } = await generateRoomId(
    req.body.privateId,
    req.params.user_id
  );

  await notifyUserOfIncomingCall(userToContact, userMakingRequest, roomId);
  // request body private key id
  // sends an event to that user notifying them that so and so would like to connect
  // returns the name of the room to connect to

  return res.status(200).send(roomId);
});

app.post("/rooms/:room_id/message", async (req, res) => {
  await sendMessageToRoom(req.params.room_id, req.body);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `The application is listening on post ${process.env.PORT || 3000}!`
  );
});
