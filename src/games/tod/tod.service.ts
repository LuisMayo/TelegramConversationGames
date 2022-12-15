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
    questionsByCat = new Map<Type, TruthOrDareQuestions[]>();

    constructor() {
        this.questions = JSON.parse(fs.readFileSync('./src/games/tod/questions.json', { encoding: 'UTF-8' }));

        for (const question of this.questions) {
            if (!this.questionsByCat.has(question.type)) {
                this.questionsByCat.set(question.type, []);
            }
            this.questionsByCat.get(question.type, question);
        }
    }

    async getGameObject(ctx?: Context): Promise<TruthOrDare> {
        let questionsArr: TruthOrDareQuestions[];
        const commandEnd = ctx.message.text
        if (ctx.message.text.includes('tod')) {
            questionsArr = this.questions;
        } else  {
            questionsArr = this.questionsByCat.get;
        } 
        return new TruthOrDare(questionsArr[Math.floor(Math.random() * questionsArr.length)].summary);
    }
}
