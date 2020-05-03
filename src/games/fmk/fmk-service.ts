import fetch from 'cross-fetch';
import { GameWithCallbackService } from '../callback-generic-class';
import Telegraf, { Context, Telegram } from 'telegraf';
import { HandlerFunctionInterface, Utils } from '../../utils';
import { ButtonKeyBoardHelper } from '../../button-keyboard-helper';
import { User, Message } from 'telegraf/typings/telegram-types';
import { GeneralService } from '../../bot';
import { FMKBean } from './fmk.bean';
import { CallbackButton, Button } from 'telegraf/typings/markup';
import * as cheerio from 'cheerio';

// Maybe this should me moved into the rrrather provider but I'll leavce it here since it's the only provider rn
export class FMKGameService extends GameWithCallbackService<FMKBean> {
    getKeyboard(): (CallbackButton | Button)[][] {
        return this.createFMKKeyboard().buttons;
    }

    static instance = new FMKGameService();
    questions: string[];

    async getGameObject(ctx: Context): Promise<FMKBean | Error> {
        try {
            const bean = new FMKBean();
            const urlBase = 'https://www.fuckmarrykillgame.com/'
            const url = ctx.message.text.includes('guys') ? urlBase + 'guys' : urlBase;
            const download = await fetch(url);
            const page = await download.text();
            const $ = cheerio.load(page);
            bean.people.push({image: urlBase + $('.thirdsdiv a')[0].attribs.href, name: $('.name > span')[0].firstChild.nodeValue});
            bean.people.push({image: urlBase + $('.thirdsdiv a')[1].attribs.href, name: $('.name > span')[1].firstChild.nodeValue});
            bean.people.push({image: urlBase + $('.thirdsdiv a')[2].attribs.href, name: $('.name > span')[2].firstChild.nodeValue});
            return bean;
        } catch (e) {
            throw new Error(e);
        }
    }

    createFMKKeyboard() {
        const keyboardHelper = new ButtonKeyBoardHelper();
        keyboardHelper.addNewButton('Fuck', 'fmk:fuck');
        keyboardHelper.addNewButton('Marry', 'fmk:marry');
        keyboardHelper.addNewButton('Kill', 'fmk:kill');
        return keyboardHelper;
    }


    public getLine(user: User, payload: string) {
        // No podemos utilizar enlaces hasta que se resuelva esto: https://github.com/telegraf/telegraf/issues/1028
        // return `User ${Utils.makeUserLink(user)} will ${payload} them`;
        return `User ${user.first_name} will ${payload} them`
    }

}