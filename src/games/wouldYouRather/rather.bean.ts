import { Context } from "telegraf";
import { GameObject } from "../game.interface";
import { RatherGameService } from "./rather-service";

export class Rather implements GameObject {
    title: string;
    choicea: string;
    choiceb: string;
    votesa: number;
    votesb: number;
    nsfw: boolean;

    sendMessage(ctx: Context) {
        let votePercentageA = '';
        let votePercentageB = '';
        if (this.votesa && this.votesb) {
            const total = this.votesa + this.votesb;
            votePercentageA = '(' + (this.votesa * 100 / total).toFixed(1) + '%) ';
            votePercentageB = '(' + (this.votesb * 100 / total).toFixed(1) + '%) ';
        }
        let message = this.nsfw ? '⚠NSFW!⚠\n' : '';
        message += `${this.title}\n ${votePercentageA}🔴 ${this.choicea}\n ${votePercentageB}🔵 ${this.choiceb}`;
        const keyboardHelper = RatherGameService.instance.createRatherKeyboard();
        ctx.reply(message, { reply_markup: { inline_keyboard: keyboardHelper.buttons } }).then(message => {
            RatherGameService.instance.saveNewMessage(ctx.chat.id.toString(), message);
        });
    }
}