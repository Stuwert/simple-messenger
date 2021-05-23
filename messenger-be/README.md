# API Overview and Implementation

The API's main job is to orchestrate connections between clients by generating "secret" roomIds for users to connnect to and ensuring that no two users end up with the same number.

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

This sends a message to a room.

```
// Request
{
  privateId: string;
}

// Response
undefined
```
