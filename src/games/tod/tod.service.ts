import { GameService } from "../generic-game.service";
import { TruthOrDare } from "./tod.bean";
import { Context } from "telegraf";
import * as fs from 'fs';
import { TruthOrDareQuestions, Type } from "./questions.bean";

export class TruthOrDareService implements GameService<TruthOrDare> {

    static instance = new TruthOrDareService();
    questions: TruthOrDareQuestions[];
    truthQuestions: TruthOrDareQuestions[] = [];
    dareQuestions: TruthOrDareQuestions[] = [];

    constructor() {
        this.questions = JSON.parse(fs.readFileSync('./src/games/tod/questions.json', { encoding: 'UTF-8' }));
        for (const question of this.questions) {
            switch (question.type) {
                case Type.Dare:
                    this.dareQuestions.push(question);
                    break;
                case Type.Truth:
                default:
                    this.truthQuestions.push(question);
                    break;
            }
        }
    }

    async getGameObject(ctx?: Context): Promise<TruthOrDare> {
        let questionsArr: TruthOrDareQuestions[];
        if (ctx.message.text.includes('tod')) {
            questionsArr = this.questions;
        } else if (ctx.message.text.includes('truth')) {
            questionsArr = this.truthQuestions;
        } else if (ctx.message.text.includes('dare')) {
            questionsArr = this.dareQuestions;
        }
        return new TruthOrDare(questionsArr[Math.floor(Math.random() * questionsArr.length)].summary);
    }
}
