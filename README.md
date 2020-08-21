![Build](https://github.com/LuisMayo/TelegramConversationGames/workflows/Build/badge.svg?branch=master)
# TelegramConversationGamesBot
Telegram bot to play conversational games
Currently only has wouldyourather, never have i ever and f*ck marry kill
You can check it at [@conversationGamesBot](https://t.me/conversationGamesBot)

Never Have I Ever questions gathered from https://github.com/stathism27/Never-Have-I-Ever and https://github.com/promise/nevrevr

Truth or Dare questions gathered from https://github.com/sylhare/Truth-or-Dare


## Getting Started

### Prerequisites

 - Node.js
 - A bot token. You can get one chatting with BotFather

### Installing

Clone the repository

```
git clone https://github.com/LuisMayo/TelegramConversationGames.git
```
npm install into the cloned repo
```
npm i
```
Copy conf/conf-dummy.json into conf.json and fill the required settings.

Build the project
`tsc`
Start the project
`node build/index.js`

### Adding a new game
You can check this commit to know how to add games: https://github.com/LuisMayo/TelegramConversationGames/commit/616d8cf6ca32c6d2b573ac3906ac65683fc1191c

In short, you have to:
 - Create a class which implements `GameObject`, this includes the method `sendMessage` which serves to send a message in response to a command
 - Create a service which extends the abstract class `GameService` and implements several methods including `getGameObject` which returns a promise with when fullfilled returns the previously created class
 - Add the service to the service factory
 - Add the handler for the inline-button and the command in index.ts


## Contributing
Since this is a tiny project we don't have strict rules about contributions. Just open a Pull Request to fix any of the project issues or any improvement you have percieved on your own. Any contributions which improve or fix the project will be accepted as long as they don't deviate too much from the project objectives. If you have doubts about whether the PR would be accepted or not you can open an issue before coding to ask for my opinion
