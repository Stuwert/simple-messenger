# Overview

This project represents an example implemenetation of a simple messaging app built with React on the Front end and Typescript and Express in the API.

There were two main requirements for the app:

- Users should be able to chat with other users (similar to facebook messenger or google chat)
- Users should see messages pop up in a reasonably short amount of time.

I was interested in the idea of the orchestration piece. Basically, how could we get away from hardcoding user values and instead allowing people to contact one another. My goal was to keep this as low overhead as possible. There were no requirements related to message storage so I stayed away from that, mainly focusing on connecting users to one another in the most succinct way possible, and while exposing as little information as possible.

I went with a "Heroku-like" naming schema where users would get a randomly assigned name and then kicked into a lobby where they could select other users to chat with. Every subsequent time they visit the website (assuming they don't clear their cache), they should have access to the same set of messages and name.

When you ask to chat with a user, they should see a pop-up (if they're on the website), asking to chat. The requesting user will immediately go to the chat room (regardless if the number exists or not). The user being requested can either cancel or accept, and they'll go into the same chat. Chats between the two users should be relatively instantaneous.

If you'd like to see a working copy on production, go to: https://simple-messenger.playthistonight.com

## Dev Set-up

The developer set-up presumes you already have Postgres, Yarn, and Node installed on your machine.

There will be some Pusher keys required to get set-up. Either create a Pusher account for yourself here: https://dashboard.pusher.com/accounts/sign_up (they have very generous terms).

To get the entire system running locally you'll need 2 terminal windows running simultaneously (one for the front end and one for the back end).

### Back End Set-up

You'll need to create a Postgres database. The example given here is with a database named `simple_messaging_app`;

```
createdb simple_messaging_app
psql
CREATE role messenger WITH LOGIN ENCRYPTED PASSWORD 'messenger';
```

The `messenger-be/env.sample` has all of the required environment keys you'll need. You can change the extension to `.env` to get it set up. The ones that are accessible for local will be prepopulated. The ones prefiexed `PUSHER_` you'll have to fill out yourself.

In order to set up the environment you'll want to install (via yarn) and then run migrations:

```
yarn install
yarn migrate
```

To start the dev environment locally:

```
yarn dev
```

Performance will be slower locally given that it uses `ts-node` rather than compiling.

I also opted not to use live reloading, so you'll need to restart between saves if that's what you want. If you want to manipulate the database during testing I'd recommend a tool like [Postico](https://eggerapps.at/postico/) or [TablePlus](https://tableplus.com/).

### Front End Set-up

The Front-end runs off of a standard Create React App set-up for ease of set-up. (The webpack build has not been ejected yet). Front-end set-up will similarly require Pusher configuration. An `env.sample` file has been made available to you.

The `API_URL` is set to port 3000 and there's a proxy in the `package.json` to route to `4000` to get around CORS issues.

Once you have `.env` set-up

```
yarn install
```

to install the packages and

```
yarn dev
```

to run the dev server.

The front end (with Create React App) has live reload, so most changes should appear instantaneously.

```
yarn install
yarn start
```

## Deployment

The app is deployed to https://simple-messenger.playthistonight.com. It uses a combination of Netlify for the front end and Heroku for the backend.

Deploying to the backend occurs via a custom build in the `package.json` (running on your local will attempt a deploy to a custom built heroku app based on this article: [How to Deploy Multiple Heroku Apps](https://adampaxton.com/how-to-deploy-to-multiple-heroku-apps-from-the-same-git-repository/)
).

Pushing to `main` will build the Netlify app out of the `messenger-fe` directory.

## A Quick Word About Jest on the API

I've added tests to both the front-end and the back-end. If you notice when running tests on the API, they hang. In my experience this is because the jest connection to the database hangs. I've decided to still include these tests because I think it's valuable for you to see how I think about testing database calls (using `--forceExit` to prevent jest from hanging), but also note that it's an unideal solution.

## Limitations and Bugs

A lot of the bugs have come about as the result of making sure the primary path works (requesting to chat with different users from a single platform). Because no messages are stored this means that anything that's not captured real time will mostly disappear. This appeared within the requirements. Things like graceful errors have mostly been ignored.

- Users will only get pinged once of an incoming message request. That means if the user isn't present to receive that request they'll pretty much never be able to contact that user again, unless they initiate!
- If a user inputs a number they already have access to, it's likely that a new session will generate and but they'll be linked to the old details.
- The send button pushes down over time and doesn't actually
- If you navigate directly to a chat it will error.
- The Browser doesn't save memory of your browsing history, so sometimes back doesn't work appropriately.
- The site is vulnerable to DDOS at the moment because opening and closing private browser tabs will create new user records.
- The mobile view currently looks attrocious (and the desktop view isn't much better).
- The local api doesn't live reload.
- The dev environments take 2 terminal windows to set up.
- It's possible for a user to spam connections to another user by hitting the connect route over and over again. I don't think this would generate multiple new connections (given that it's the same roomId), but it would spam pop-ups.
- Currently the POST message route doesn't validate that the user in question has access to the room.
- The timestamps on user create records don't save (they need to be added to the insert).
- There's no validation on public or private key (and the insert isn't retried), so it's possible to fail on the loading state if one of those were to hit a unique constraint.
- Public and Private keys can get lost forever if the user clears local cache without
- There's no back button to easily access the lobby from a chat.
- Cors is set to allow all. It could be better restricted.
- The input for "Connect to new user" is not forgiving
- There's a nod in the data-structure but no explicit sort on created/updated date, so if messages accidentally get saved in the wrong order they'll stay that way.
- There's no defined character limit, so it will likely error based on whatever Pusher's requirements are.

## Strengths and Weaknesses of this Approach

### Strengths

The benefit to this approach is there is very minimal surface area for a user to attack our database or gain access to sensitive information that we're storing. Because messages are going through React/Ant Design inputs and Pusher on the backend, there's other libraries in place preventing things like cross-site scripting or attacks that we might have to mitigate if we were storinng the information in our databases.

### Weaknesses

The downside to this approach is that it has the look of a chat service but none of the data persistence. It's hard to tell when another use is on, and if you send them messages when they're not, they disappear forever. From a UX perspective it means that there might be expectations not being met. This could be mitigated by queueing and retrying certain messages, or waiting for them to be present in a channel to send, however that would require more data storage.

## Questions, Comments, Concerns

Please log an issue on this repo if you run into any bugs.
