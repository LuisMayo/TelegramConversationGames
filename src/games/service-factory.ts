import { GameObject } from "./game.interface";
import { RatherGameService } from "./wouldYouRather/rather-service";
import { NeverGameService } from "./neverHaveIEver/never-service";
import { GameService } from "./generic-game.service";
import { FMKGameService } from "./fmk/fmk-service";

export function GetGameFromString(game: Games): GameService<GameObject> {
    switch (game) {
        case Games.RATHER:
            return RatherGameService.instance;
        case Games.NEVER:
            return NeverGameService.instance;
        case Games.FMK:
            return FMKGameService.instance;
    }
}

export enum Games {
    RATHER = 'rather',
    NEVER = 'never',
    FMK = 'fmk'
};