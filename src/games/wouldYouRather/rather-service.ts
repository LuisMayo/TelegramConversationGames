import { GameWithCallbackService } from '../callback-generic-class';
import { Rather } from './rather.bean';
import { Utils } from '../../utils';
import { ButtonKeyBoardHelper } from '../../button-keyboard-helper';
import { User, Message } from 'telegraf/typings/telegram-types';
import { GetEitheroQuestion as GetEitherioQuestion } from './providers/either-io';

// Maybe this should me moved into the rrrather provider but I'll leavce it here since it's the only provider rn
export class RatherGameService extends GameWithCallbackService<Rather> {

    static instance = new RatherGameService();

    getGameObject(): Promise<Rather | Error> {
        return GetEitherioQuestion();
    }


    createRatherKeyboard() {
        const keyboardHelper = new ButtonKeyBoardHelper();
        keyboardHelper.addNewButton('🔴', 'rather:a');
        keyboardHelper.addNewButton('🔵', 'rather:b');
        return keyboardHelper;
    }

    public getLine(user: User, payload: string) {
        return `User ${Utils.makeUserLink(user)} has selected ${payload === 'a' ? '🔴' : '🔵'}`;
    }

    public getKeyboard() {
        return this.createRatherKeyboard().buttons;
    }
}