import fetch from 'cross-fetch';
import { GameWithCallbackService } from '../callback-generic-class';
import Telegraf, { Context, Telegram } from 'telegraf';
import { HandlerFunctionInterface, Utils } from '../../utils';
import { ButtonKeyBoardHelper } from '../../button-keyboard-helper';
import { User, Message } from 'telegraf/typings/telegram-types';
import { GeneralService } from '../../bot';
import * as fs from 'fs';
import { GameService } from '../generic-game.service';
import { PressTheButtonBean } from './press-the-button.bean';
import * as cheerio from 'cheerio';

// Maybe this should me moved into the rrrather provider but I'll leavce it here since it's the only provider rn
export class PressTheButtonService extends GameWithCallbackService<PressTheButtonBean> implements GameService<PressTheButtonBean>  {

    static instance = new PressTheButtonService();
    questions: string[];

    constructor() {
        super();
        this.questions = JSON.parse(fs.readFileSync('./src/games/neverHaveIEver/questions.json', { encoding: 'UTF-8' }));
    }

    async getGameObject(ctx: Context): Promise<PressTheButtonBean | Error> {
        try {
            const download = await fetch('https://www.willyoupressthebutton.com/');
            const page = await download.text();
            const $ = cheerio.load(page);
            const bean = new PressTheButtonBean($('#cond').text(), $('#res').text());
            return bean;
        } catch (e) {
            throw new Error(e);
        }
    }

    createNeverKeyboard() {
        const keyboardHelper = new ButtonKeyBoardHelper();
        keyboardHelper.addNewButton('Press it! 🔴', 'pressTheButton:y');
        keyboardHelper.addNewButton('Don\'t press it', 'pressTheButton:n');
        return keyboardHelper;
    }

    public getLine(user: User, payload: string) {
        return `User ${Utils.makeUserLink(user)} ${payload === 'y' ? 'would' : 'wouldn\'t'} press the button`;
    }

    public getKeyboard() {
        return this.createNeverKeyboard().buttons;
    }
}