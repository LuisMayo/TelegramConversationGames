import { Context } from "telegraf";
import { GameObject } from "../game.interface";
import { NeverGameService } from "./never-service";

export class NeverBean implements GameObject {

    constructor(public title: string) {

    }

    sendMessage(ctx: Context) {
        const keyboardHelper = NeverGameService.instance.createNeverKeyboard();
        ctx.reply(this.title, { reply_markup: { inline_keyboard: keyboardHelper.buttons } }).then(message => {
            NeverGameService.instance.saveNewMessage(ctx.chat.id.toString(), message);
        });
    }
}