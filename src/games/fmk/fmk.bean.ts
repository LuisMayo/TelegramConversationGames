import { GameObject } from "../game.interface";
import { Context } from "telegraf";
import { MessageMedia, InputMediaPhoto } from "telegraf/typings/telegram-types";
import { FMKGameService } from "./fmk-service";

export class FMKBean implements GameObject {
    public people: Person[] = [];

    sendMessage(ctx: Context): void {
        let media: InputMediaPhoto[] = [];
        let testMessage = `Who would you fuck, marry and kill? (Hint: Open an image to get their name)\n1️⃣: F: ${this.people[0].name} M: ${this.people[1].name} K:${this.people[2].name}\n` +
        `2️⃣: F: ${this.people[2].name} M: ${this.people[0].name} K:${this.people[1].name}\n` + 
        `3️⃣: F: ${this.people[1].name} M: ${this.people[2].name} K:${this.people[0].name}\n` +
        `4️⃣: F: ${this.people[2].name} M: ${this.people[1].name} K:${this.people[0].name}\n` +
        `5️⃣: F: ${this.people[0].name} M: ${this.people[2].name} K:${this.people[1].name}\n` +
        `6️⃣: F: ${this.people[1].name} M: ${this.people[0].name} K:${this.people[2].name}\n`;
        for (const person of this.people) {
            media.push({ media: person.image, type: 'photo', caption: person.name });
        }
        const keyboardHelper = FMKGameService.instance.createFMKKeyboard();
        ctx.replyWithMediaGroup(media).then(messages => {
            ctx.reply(testMessage, {reply_markup: { inline_keyboard: keyboardHelper.buttons }}).then(message => {
                FMKGameService.instance.saveNewMessage(ctx.chat.id.toString(), message);
            })
        });
    }

}

type Person = {
    name: string;
    image: string;
}