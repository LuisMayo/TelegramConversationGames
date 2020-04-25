import { GameObject } from "./game.interface";

export interface GameService <T extends GameObject> {
    getGameObject(): Promise<T | Error>;
}