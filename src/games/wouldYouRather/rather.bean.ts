import { Context } from "telegraf";
import { GameObject } from "../game.interface";

export class Rather implements GameObject {
    title:       string;
    choicea:     string;
    choiceb:     string;
    votesa:       number;
    votesb:       number;
    nsfw:        boolean;

    sendMessage(ctx: Context) {
        let message = this.nsfw ? '⚠NSFW!⚠\n' : '';
        message += `${this.title}\n - ${this.choicea}\n - ${this.choiceb}`;
        ctx.reply(message);
    }
}