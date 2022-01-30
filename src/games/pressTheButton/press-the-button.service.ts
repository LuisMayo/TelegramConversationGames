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
import { PressTheButtonResponse } from './press-the-button-response';

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
            let show_unconfirmed = false;
            const download = await fetch('https://api2.willyoupressthebutton.com/api/v2/dilemma/',
            {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({show_unconfirmed})
            });
            const object: PressTheButtonResponse = await download.json();
            const bean = new PressTheButtonBean(object.dilemma);
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