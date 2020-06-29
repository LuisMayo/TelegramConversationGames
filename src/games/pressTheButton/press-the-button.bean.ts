import { GameObject } from "../game.interface";
import { Context } from "telegraf";
import { PressTheButtonService } from "./press-the-button.service";

export class PressTheButtonBean implements GameObject {
    constructor(public pro: string, public con: string) {
        this.pro = this.pro.trim();
        this.con = this.con.trim();
    }


    sendMessage(ctx: Context): void {
        const keyboardHelper = PressTheButtonService.instance.createNeverKeyboard();
        ctx.reply('Would you press the button if\n\n' + this.pro + '\n\nbut\n\n' + this.con, { reply_markup: { inline_keyboard: keyboardHelper.buttons } }).then(message => {
            PressTheButtonService.instance.saveNewMessage(ctx.chat.id.toString(), message);
        });
    }

}