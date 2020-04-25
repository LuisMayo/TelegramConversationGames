import { Rather } from "../../rather.bean";

export interface RrratherResponse {
    title:       string;
    choicea:     string;
    choiceb:     string;
    link:        string;
    tags:        boolean;
    explanation: boolean;
    votes:       number;
    nsfw:        boolean;
}

export function convertFromRrrather(rrrather: RrratherResponse) {
    const rather = new Rather();
    rather.title = rrrather.title;
    rather.choicea = rrrather.choicea;
    rather.choiceb = rrrather.choiceb;
    rather.nsfw = rrrather.nsfw;
    rather.votesa = rather.votesb = null;
    return rather;
}