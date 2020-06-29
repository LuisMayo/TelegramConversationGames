import { GameObject } from "./game.interface";
import { Context } from "telegraf";
import { HandlerFunctionInterface } from "../utils";

export interface GameService <T extends GameObject> {
    getGameObject(ctx?: Context): Promise<T | Error>;
    handleCallBack?: HandlerFunctionInterface;
} 