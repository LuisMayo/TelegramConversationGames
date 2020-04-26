import { GameService } from "./service.interface";
import { GameObject } from "./game.interface";
import { RatherGameService } from "./wouldYouRather/rather-service";

export function GetGameFromString(game: Games): GameService<GameObject> {
    switch(game) {
        case Games.RATHER:
            return new RatherGameService();
    }
}

export enum Games {
    RATHER = 'rather'
};