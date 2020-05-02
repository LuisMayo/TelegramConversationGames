import { GameObject } from "./game.interface";
import { Context } from "telegraf";

export interface GameService <T extends GameObject> {
    getGameObject(ctx?: Context): Promise<T | Error>;
} 