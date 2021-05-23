# Overview

This project represents an example implemenetation of a simple messenging app built with React on the Front end and Typescript and Express in the API.

I got excited by the concept of the project (a straightforward messaging app), and wanted to think through how to allow multiple people to directly communicate with one another but without the overhead of definingn things like authentication and users (as specified by the requirements), and also to nod at "privacy" by making it hard for different members to snoop on each other's calls simply by knowing user names.

I went with a "Heroku-like" naming schema where users would get a randomly assigned name and then kicked into the chat. Every subsequent time they visit the website (assuming they don't clear their cache), they should have access to the same set of messages and name.

## Limitations and Bugs

- Users will only get pinged once of an incoming message request. That means if the user isn't present to receive that request they'll pretty much never be able to contact that user again, unless they initiate!

## Front End

To get the front end started

```
yarn install
yarn start
```

https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

- TODO: Also get the env vars set up so this can connect appropriately to the rest of the stuff
- Also explain it in the README

## Deployment

Deployment details taken from [How to Deploy Multiple Heroku Apps](https://adampaxton.com/how-to-deploy-to-multiple-heroku-apps-from-the-same-git-repository/)

## Installation Step
