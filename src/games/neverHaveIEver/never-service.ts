import fetch from 'cross-fetch';
import { GameService } from '../service.interface';
import { NeverBean } from './never.bean';
import Telegraf, { Context, Telegram } from 'telegraf';
import { HandlerFunctionInterface, Utils } from '../../utils';
import { ButtonKeyBoardHelper } from '../../button-keyboard-helper';
import { User, Message } from 'telegraf/typings/telegram-types';
import { GeneralService } from '../../bot';

// Maybe this should me moved into the rrrather provider but I'll leavce it here since it's the only provider rn
export class NeverGameService extends GameService<NeverBean> {

    static instance = new NeverGameService();
    questions: string[];

    getGameObject(): Promise<NeverBean | Error> {
        return Promise.resolve(new NeverBean(this.questions[Math.floor(Math.random() * this.questions.length)]));
    }

    createNeverKeyboard() {
        const keyboardHelper = new ButtonKeyBoardHelper();
        keyboardHelper.addNewButton('I have', 'never:y');
        keyboardHelper.addNewButton('I have never', 'never:n');
        return keyboardHelper;
    }

    public getLine(user: User, payload: string) {
        return `User ${Utils.makeUserLink(user)} has ${payload === 'y' ? 'done it 😈' : 'never done it 😇'}`;
    }

    public getKeyboard() {
        return this.createNeverKeyboard().buttons;
    }
}