import fetch from 'cross-fetch';
import { GameService } from '../service.interface';
import { Rather } from './rather.bean';
import { convertFromRrrather } from './providers/rrrather/rrrather.interface';
import Telegraf, { Context, Telegram } from 'telegraf';
import { HandlerFunctionInterface, Utils } from '../../utils';
import { ButtonKeyBoardHelper } from '../../button-keyboard-helper';
import { User, Message } from 'telegraf/typings/telegram-types';
import { BotService } from '../../bot';

// Maybe this should me moved into the rrrather provider but I'll leavce it here since it's the only provider rn
export class RatherGameService implements GameService<Rather> {
    static messagesHistory: Map<string, {text: string, usersArr: {user: User, choice: string}[]}> = new Map();

    getGameObject(): Promise<Rather | Error> {
        return new Promise((resolve, reject) => {
            fetch('https://www.rrrather.com/botapi').then(data => {
                data.json().then(object => resolve(convertFromRrrather(object))).catch(reject);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static handleCallBack: HandlerFunctionInterface = (ctx: Context, payload: string) => {
        const id = ctx.chat.id + ':' + ctx.callbackQuery.message.message_id;
        const gameMessage = RatherGameService.messagesHistory.get(id);
        const user = gameMessage.usersArr.find(user => user.user.id === ctx.from.id);
        if (user != null) {
            user.choice = payload;
        } else {
            gameMessage.usersArr.push({choice: payload, user: ctx.from});
        }
        ctx.editMessageText(gameMessage.text + '\n' + RatherGameService.generateTextForUserList(gameMessage.usersArr), {parse_mode: 'Markdown', reply_markup: {inline_keyboard: RatherGameService.createRatherKeyboard().buttons}});
    }

    public static saveNewMessage(chatId: string, mess: Message) {
        const id = chatId + ':' + mess.message_id;
        if (!RatherGameService.messagesHistory.has(id)) {
            RatherGameService.messagesHistory.set(id, {text: mess.text, usersArr: []});
            setTimeout(RatherGameService.expiredMessage, 24 * 60 * 60 * 1000, id);
        }
        return id;
    }

    private static expiredMessage(id: string) {
        const separatorIndex = id.indexOf(':');
        BotService.bot.telegram.editMessageReplyMarkup(id.substring(0, separatorIndex), +id.substring(separatorIndex +1) , null, '');
        RatherGameService.messagesHistory.delete(id);
    }

    static generateTextForUserList(arr: {user: User, choice: string}[]) {
        let text = '';
        for (let i=0; i < arr.length; i++) {
            const user = arr[i];
            text += RatherGameService.getLine(user.user, user.choice);
            if (i !== arr.length - 1) {
                text += '\n';
            }
        }
        return text;
    }

    static createRatherKeyboard() {
        const keyboardHelper = new ButtonKeyBoardHelper();
        keyboardHelper.addNewButton('🔴', 'rather:a');
        keyboardHelper.addNewButton('🔵', 'rather:b');
        return keyboardHelper;
    }

    private static getLine(user: User, payload: string) {
        return `User ${Utils.makeUserLink(user)} has selected ${payload === 'a' ? '🔴' : '🔵'}`;
    }
}