import { Rather } from "../rather.bean";
import fetch  from 'cross-fetch';

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

export function GetRrratherQuestion(): Promise<Rather | Error> {
    return new Promise((resolve, reject) => {
        fetch('https://www.rrrather.com/botapi').then(data => {
            data.json().then(object => resolve(convertFromRrrather(object))).catch(reject);
        }).catch(error => {
            reject(error);
        });
    });
}