import { Context } from "telegraf";

export interface GameObject {
    sendMessage(ctx: Context): void;
}