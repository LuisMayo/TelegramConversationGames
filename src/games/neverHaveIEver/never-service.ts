import fetch from 'cross-fetch';
import { GameWithCallbackService } from '../callback-generic-class';
import { NeverBean } from './never.bean';
import Telegraf, { Context, Telegram } from 'telegraf';
import { HandlerFunctionInterface, Utils } from '../../utils';
import { ButtonKeyBoardHelper } from '../../button-keyboard-helper';
import { User, Message } from 'telegraf/typings/telegram-types';
import { GeneralService } from '../../bot';
import * as fs from 'fs';

// Maybe this should me moved into the rrrather provider but I'll leavce it here since it's the only provider rn
export class NeverGameService extends GameWithCallbackService<NeverBean> {

    static instance = new NeverGameService();
    questions: string[];

    constructor() {
        super();
        this.questions = JSON.parse(fs.readFileSync('../questions.json', { encoding: 'UTF-8' }));
    }

    getGameObject(ctx: Context): Promise<NeverBean | Error> {
        return Promise.resolve(new NeverBean(this.questions[Math.floor(Math.random() * this.questions.length)]));
    }

    createNeverKeyboard() {
        const keyboardHelper = new ButtonKeyBoardHelper();
        keyboardHelper.addNewButton('I have', 'never:y');
        keyboardHelper.addNewButton('I have never', 'never:n');
        return keyboardHelper;
    }

    public getLine(user: User, payload: string) {
        return `User ${Utils.makeUserLink(user)} has ${payload === 'y' ? 'done it' : 'never done it'}`;
    }

    public getKeyboard() {
        return this.createNeverKeyboard().buttons;
    }
}