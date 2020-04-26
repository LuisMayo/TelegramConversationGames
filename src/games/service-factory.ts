import { GameService } from "./service.interface";
import { GameObject } from "./game.interface";
import { RatherGameService } from "./wouldYouRather/rather-service";
import { NeverGameService } from "./neverHaveIEver/never-service";

export function GetGameFromString(game: Games): GameService<GameObject> {
    switch (game) {
        case Games.RATHER:
            return RatherGameService.instance;
        case Games.NEVER:
            return NeverGameService.instance;
    }
}

export enum Games {
    RATHER = 'rather',
    NEVER = 'never'
};