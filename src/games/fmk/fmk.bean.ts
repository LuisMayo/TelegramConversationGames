import { GameObject } from "../game.interface";
import { Context } from "telegraf";
import { InputMediaPhoto } from "telegraf/typings/telegram-types";
import { FMKGameService } from "./fmk-service";

export class FMKBean implements GameObject {
    public people: Person[] = [];

    sendMessage(ctx: Context): void {
        let media: InputMediaPhoto[] = [];
        for (const person of this.people) {
            media.push({ media: person.image, type: 'photo', caption: person.name });
        }
        ctx.replyWithMediaGroup(media).then(messages => {
            this.sendPersonMessage(0, ctx);
        });
    }
    
    private sendPersonMessage(index: number, ctx: Context) {
        const keyboardHelper = FMKGameService.instance.createFMKKeyboard();
        ctx.reply(`What would you do with ${this.people[index].name}?`, {reply_markup: { inline_keyboard: keyboardHelper.buttons }}).then(message => {
            FMKGameService.instance.saveNewMessage(ctx.chat.id.toString(), message);
            if (index < 2) {
                this.sendPersonMessage(index + 1, ctx);
            }
        });
    }

}

type Person = {
    name: string;
    image: string;
}