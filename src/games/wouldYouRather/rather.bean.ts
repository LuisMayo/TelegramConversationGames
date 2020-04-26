import { Context } from "telegraf";
import { GameObject } from "../game.interface";
import { RatherGameService } from "./rather-service";

export class Rather implements GameObject {
    title:       string;
    choicea:     string;
    choiceb:     string;
    votesa:       number;
    votesb:       number;
    nsfw:        boolean;

    sendMessage(ctx: Context) {
        let message = this.nsfw ? '⚠NSFW!⚠\n' : '';
        message += `${this.title}\n 🔴 ${this.choicea}\n 🔵 ${this.choiceb}`;
        const keyboardHelper = RatherGameService.instance.createRatherKeyboard();
        ctx.reply(message, {reply_markup: {inline_keyboard: keyboardHelper.buttons}}).then(message => {
            RatherGameService.instance.saveNewMessage(ctx.chat.id.toString(), message);
        });
    }
}