Using knex here because I'm trying to keep the backend light.

The goal of the backend is mostly to orchestrate rooms based on different names, and then manage sending messages back and forth between them.

I actually think it should be a post request to get the room name back, that way it's encrypted.

i.e. the user requests a room, the db encrypts it and then sends it back

- As long as the encryption pattern is always the same this should be fine: sort by name, encrypt, return the room.

## Overview of the API

There are no keys as it's presumed to already have them or be added in other ways

- POST /users/create
- POST /rooms/join (requests the code for the)
  - If the user doesn't exist it makes some gibberish up, that way you don't have access to a user you've never met before
- Pusher stuff
