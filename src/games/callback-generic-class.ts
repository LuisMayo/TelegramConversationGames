import { GameObject } from "./game.interface";
import { User, Message } from "telegraf/typings/telegram-types";
import { HandlerFunctionInterface } from "../utils";
import { Context } from "telegraf";
import { GeneralService } from "../bot";
import { CallbackButton, Button } from "telegraf/typings/markup";

export abstract class GameWithCallbackService <T extends GameObject> {
    static messagesHistory: Map<string, {text: string, usersArr: {user: User, payload: string}[]}> = new Map();

    handleCallBack: HandlerFunctionInterface = (ctx: Context, payload: string) => {
        const id = ctx.chat.id + ':' + ctx.callbackQuery.message.message_id;
        const gameMessage = GameWithCallbackService.messagesHistory.get(id);
        if (gameMessage) {
            const user = gameMessage.usersArr.find(user => user.user.id === ctx.from.id);
            if (user != null) {
                user.payload = payload;
            } else {
                gameMessage.usersArr.push({payload: payload, user: ctx.from});
            }
            ctx.editMessageText(gameMessage.text + '\n' + this.generateTextForUserList(gameMessage.usersArr), {parse_mode: 'Markdown', reply_markup: {inline_keyboard: this.getKeyboard()}});
            ctx.answerCbQuery();
        }
    }

    generateTextForUserList(arr: {user: User, payload: string}[]) {
        let text = '';
        for (let i=0; i < arr.length; i++) {
            const user = arr[i];
            text += this.getLine(user.user, user.payload);
            if (i !== arr.length - 1) {
                text += '\n';
            }
        }
        return text;
    }

    public saveNewMessage(chatId: string, mess: Message) {
        const id = chatId + ':' + mess.message_id;
        if (!GameWithCallbackService.messagesHistory.has(id)) {
            GameWithCallbackService.messagesHistory.set(id, {text: mess.text, usersArr: []});
            setTimeout(this.expiredMessage, 24 * 60 * 60 * 1000, id);
        }
        return id;
    }

    
    private expiredMessage(id: string) {
        const separatorIndex = id.indexOf(':');
        GeneralService.bot.telegram.editMessageReplyMarkup(id.substring(0, separatorIndex), +id.substring(separatorIndex +1) , null, '');
        GameWithCallbackService.messagesHistory.delete(id);
    }
    
    abstract getGameObject(): Promise<T | Error>;
    abstract getLine(user: User, payload: string): string;
    abstract getKeyboard(): (CallbackButton | Button)[][];
}