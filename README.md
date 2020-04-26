# TelegramConversationGamesBot
Telegram bot to play conversational games
Currently only has wouldyourather and never have i ever
You can check it at [@conversationGamesBot](t.me/conversationGamesBot)

Never Have I Ever questions gathered from https://github.com/stathism27/Never-Have-I-Ever and https://github.com/promise/nevrevr

### Adding a new game
You can check this commit to know how to add games: https://github.com/LuisMayo/TelegramConversationGames/commit/616d8cf6ca32c6d2b573ac3906ac65683fc1191c

In short, you have to:
 - Create a class which implements `GameObject`, this includes the method `sendMessage` which serves to send a message in response to a command
 - Create a service which extends the abstract class `GameService` and implements several methods including `getGameObject` which returns a promise with when fullfilled returns the previously created class
 - Add the service to the service factory
 - Add the handler for the inline-button and the command in index.ts
