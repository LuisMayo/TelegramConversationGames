import { Context } from "telegraf";
import { User } from "telegraf/typings/telegram-types";

export type HandlerFunctionInterface = (ctx: Context, payload: string) => void;

export class Utils {
    private static callbackHandlers: Map<string, HandlerFunctionInterface> = new Map();
    static registerHandler(key: string, fn: HandlerFunctionInterface) {
        this.callbackHandlers.set(key, fn);
    }
    static executeCallback(ctx: Context) {
        const callBackData = ctx.callbackQuery.data;
        const separatorIndex = callBackData.indexOf(':');
        const id = callBackData.substring(0, separatorIndex);
        const payload = callBackData.substring(separatorIndex + 1);
        if (Utils.callbackHandlers.has(id)) {
            Utils.callbackHandlers.get(id)(ctx, payload);
        } else {
            console.error('Handler undefined for id '+ id);
        }
    }

    static makeUserLink(usr: User) {
        return `[${usr.first_name}](tg://user?id=${usr.id})`
    }
    
}