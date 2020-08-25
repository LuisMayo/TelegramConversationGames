import { CommandObject } from "./command-object";
import { Context } from "telegraf";
import { Games } from "./games/service-factory";
import { ButtonKeyBoardHelper } from "./button-keyboard-helper";

export class RandomGame {
    static regexp: RegExp;
    static commandList: CommandObject[];
    static processGameCommand: (ctx: Context, game: Games) => any;

    
    static initFirstTimeMessage(ctx: Context) {
        const commands = RandomGame.commandList.map((command) => command.id.toString());
        RandomGame.printMessage(ctx, commands, false);
    }
    
    static initRandomHelper(commandList: CommandObject[], processGameCommand: (ctx: Context, game: Games) => any) {
        RandomGame.commandList = commandList;
        RandomGame.processGameCommand = processGameCommand;
        // The regular expression of the random command must follow the pattern /random0gamea1gameb1gamec2
        RandomGame.regexp = new RegExp(`/randomx((\\d)+y)*?(\\d)+z`);
    }
    
    static makeToggleKeyboard (commands: string[]) {
        const kb = new ButtonKeyBoardHelper();
        for (const command of RandomGame.commandList) {
            let newCommandArr = [...commands];
            let currentlyIn: boolean;
            let commandIndex = commands.findIndex(value => +value === command.id);
            if (commandIndex > -1) {
                newCommandArr.splice(commandIndex, 1);
                currentlyIn = true;
            } else {
                newCommandArr.push(command.id.toString());
                currentlyIn = false;
            }
            kb.addNewButton(command.command + (currentlyIn ? '✅' : '❌'), 'randomx' + newCommandArr.join('y') + 'z');
        }
        return kb.buttons;
    }

    static printMessage(ctx: Context, commands: string[], edit: boolean) {
        const fun = edit ? ctx.editMessageText : ctx.reply;
        fun('You can use the buttons bellow to configure your game, once you\'re ready launch your game with the following link\n/randomx' +
            commands.join('y') + 'z', {reply_markup: {inline_keyboard: RandomGame.makeToggleKeyboard(commands)}});
    }

    static processButtonChange(ctx: Context) {
        const payload = ctx.callbackQuery.data.substring(ctx.callbackQuery.data.indexOf('x') + 1, ctx.callbackQuery.data.indexOf('z'));;
        RandomGame.printMessage(ctx, payload.split('y'), true);
    }

    static randomCommand(ctx: Context) {
        if (RandomGame.regexp.test(ctx.message.text)) {
            // x will define the start of the message z the end, and y the separator
            const payload =  ctx.message.text.substring(ctx.message.text.indexOf('x') + 1, ctx.message.text.indexOf('z'));
            const possibleGames = payload.split('y');
            const selectedCommand = possibleGames[Math.floor(Math.random() * possibleGames.length)];
            const selectedGame = RandomGame.commandList.find(game => +selectedCommand === game.id);
            ctx.message.text = '/' + selectedGame.command;
            RandomGame.processGameCommand(ctx, selectedGame.game);
        }
    }
}