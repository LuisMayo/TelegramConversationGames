import { GameObject } from "../game.interface";
import { Context } from "telegraf";

export class TruthOrDare implements GameObject {
    constructor(public title: string) {
    }


    sendMessage(ctx: Context): void {
        ctx.reply(this.title);
    }

}