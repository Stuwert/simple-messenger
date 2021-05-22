import express from "express";
import bodyParser from "body-parser";

require("dotenv").config();

import createUser from "./services/createUser";
import generateRoomId from "./services/generateRoomId";
import notifyUserOfIncomingCall from "./services/notifyUserOfIncomingCall";

const app = express();
var jsonParser = bodyParser.json();
app.use(jsonParser);

app.get("/", (req, res) => {
  res.send("it works");
});

app.post("/users/create", async (req, res) => {
  const user = await createUser(req.body.userName);
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

  await notifyUserOfIncomingCall(userToContact, userMakingRequest);
  // request body private key id
  // sends an event to that user notifying them that so and so would like to connect
  // returns the name of the room to connect to

  return res.status(200).send(roomId);
});

app.listen(3000, () => {
  console.log("The application is listening on post 3000!");
});
