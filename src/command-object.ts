import { Games } from "./games/service-factory";
export interface CommandObject {
    id: number;
    command: string;
    game: Games;
}
