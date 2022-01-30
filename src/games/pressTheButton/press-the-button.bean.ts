import { GameObject } from "../game.interface";
import { Context } from "telegraf";
import { PressTheButtonService } from "./press-the-button.service";
import { Dilemma } from "./press-the-button-response";
import { HTMLEncoder } from "./html-decoder";

export class PressTheButtonBean implements GameObject {
    private yesPercentage: number;
    constructor(public bean: Dilemma) {
        bean.txt1 = HTMLEncoder.htmlDecode(bean.txt1.trim());
        bean.txt2 = HTMLEncoder.htmlDecode(bean.txt2.trim());
        this.yesPercentage = Math.round(bean.yes * 100 / (bean.yes + bean.no));
    }


    sendMessage(ctx: Context): void {
        const keyboardHelper = PressTheButtonService.instance.createNeverKeyboard();
        ctx.reply(`Would you press the button if\n\n${this.bean.txt1}\n\nbut\n\n${this.bean.txt2}\n=====\n${this.yesPercentage}% of users would press the button\n=====\n`,
        { reply_markup: { inline_keyboard: keyboardHelper.buttons } }).then(message => {
            PressTheButtonService.instance.saveNewMessage(ctx.chat.id.toString(), message);
        });
    }

}
