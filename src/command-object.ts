import { Games } from "./games/service-factory";
export interface CommandObject {
    command: string;
    game: Games;
}
