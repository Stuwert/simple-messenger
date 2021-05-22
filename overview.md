## Goals of the project

- assign a user id on connection to the server
- start by defaulting to a single room

### Requirements

- It's possible

- Pick an id to assign
- save to local storage
- pick someone to message
- Send a message
- see a list of existing messages
- assigns a new id or asks for existing (default to new id)

### Local Storages

- simple_messenger_app_private_id
- simple*messenger_app_chat*[public_id]
- simple_messenger_app_chats (list of all public ids I'm chatting with)

```
{
  messages: Message[];
  userName: String
}
```

### Backend

- establish a connection with the api
- check if that user already exists (in memory)
-

```
Db Structure
Users
- id: Number
- userName: string
- publicId: string (8 characters)
- privateKey: string (hash)
```

on login, generates a new combo at random, returns the private key and the public key.

### Message Structure

```
{
  userName: String,
  sentAt: Date,
  message: String;
}
```

- sent to the api (stored in local storage on successful save)

### Stretch

- Copy the messages across the

Do I actually need to add an id? it's not part of the requirement.

I think the approach here is to have a single repo with two different package jsons and let them serve separately

so... let's build a basic web app that does a thing and displays
I'm going to store this locally in pouch db

### Requirements FE

- Should display a welcome screen
- Should allow you to view existing
- Should save to local storage
- userId

### Requirements BE

- The server should not store any information

### Stretch

- If you have a pre-existing Id, you can paste it in to copy over existing messages, though it won't sync between them.
- Need to access your id on demand
- Should prompt you to instead input an id rather than

(so there would basically be a private key and a public key). The public key is accessible for all of the things, but the private key is only accessible from the user's perspective. Generate them both on new account create

### Moar backend stuff

- simple express server
- POST request for a new user
- sockets io
