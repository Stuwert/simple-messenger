# API Overview and Implementation

The API's main job is to orchestrate connections between clients by generating "secret" roomIds for users to connnect to and ensuring that no two users end up with the same number.

I was interested in the concept of orchestrating messages between multiple users (within the constraint of 2 per room) and understanding how to validate that users were connecting to the same room regardless of which one requested the connection. The decision I landed on was to sort the two user's connection strings (in this case `private_id`) alphabetically. This implementation works as long as the number of users in a chat is constant, but would break down if it were possible to add users to a room and maintain a similar room id.

## Data Structures

There's a single table: `users`

```
Users:
- id: number (increments)
- created_at: timestamp
- updated_at: timestamp
- private_id: string (unique)
- public_id: string (###-###) (unique)
- username: string
```

Initially I created `username` as a self-identifier that users could add to their own "accounts", but I ultimately decided to assign it in as an easier implementation detail. Usernames are not unique however, while the public and private keys are unique.

## Routes

### POST /users/create

This route gets hit when a user first logs in, and should not be hit after that.

```
// Request Body
{}

// Response Body
{
  publicId: String;
  privateId: String;
  username: String;
}
```

### POST /users/:user_id/connect

This is how a user requests a connection to another user. The API should respond with a roughly unique `roomId` regardless whether or not the `publicKey` currently exists. This is a _nod_ at identity obfuscation.

```
// Request
{
  privateId: string
}

// Response
roomId
```

### POST /rooms/:room_id/message

This sends a message to a room. I added this as a workaround to not have to deal with Pusher's Private Rooms (which is a requirement to allow client to client communication). Fundamentally nothing about the approach I've laid out with room ids would have changed implementing that path though.

```
// Request
{
  privateId: string;
}

// Response
undefined
```
