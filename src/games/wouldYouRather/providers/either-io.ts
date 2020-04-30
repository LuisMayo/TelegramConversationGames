import { Rather } from "../rather.bean";
import fetch  from 'cross-fetch';

export interface EitherIo {
    questions: Question[];
}

export interface Question {
    id:               string;
    live_id:          string;
    user_id:          string;
    option_1:         string;
    option_2:         string;
    option1_total:    string;
    option2_total:    string;
    comment_total:    string;
    featured:         string;
    published:        string;
    slug:             string;
    prefix:           string;
    twitter_sentence: string;
    short_url:        string;
    is_adult:         string;
    gender:           string;
    moreinfo:         string;
    created_on:       string;
    updated_on:       string;
    updated_by:       string;
    comments_enabled: string;
    title:            string;
    is_anonymous:     string;
    device_id:        null | string;
    platform:         null | string;
    platform_version: null | string;
    liked:            string;
    disliked:         string;
    email:            string;
    user_is_deleted:  string;
    display_name:     string;
    favorited:        string;
    tags:             Tag[];
}


export interface Tag {
    id:         string;
    name:       string;
    published:  string;
    created_on: string;
    slug:       string;
}

export function convertFromEitherio(ratherio: EitherIo) {
    const rather = new Rather();
    const question = ratherio.questions[0];
    rather.title = question.prefix && question.prefix.length > 0 ? question.prefix : 'Would you rather...';
    rather.choicea = question.option_1;
    rather.choiceb = question.option_2;
    rather.nsfw =  question.is_adult === '1';
    rather.votesa = +question.option1_total;
    rather.votesb = +question.option2_total;
    return rather;
}

export function GetEitheroQuestion(): Promise<Rather | Error> {
    return new Promise((resolve, reject) => {
        fetch('http://either.io/questions/next/1').then(data => {
            data.json().then(object => resolve(convertFromEitherio(object))).catch(reject);
        }).catch(error => {
            reject(error);
        });
    });
}