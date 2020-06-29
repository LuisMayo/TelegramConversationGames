import { CommandObject } from "./command-object";
import { Context } from "telegraf";
import { Games } from "./games/service-factory";
import { ButtonKeyBoardHelper } from "./button-keyboard-helper";

export class RandomGame {
    static regexp: RegExp;
    static commandList: CommandObject[];
    static processGameCommand: (ctx: Context, game: Games) => any;

    
    static initFirstTimeMessage(ctx: Context) {
        const commands = RandomGame.commandList.map(command => command.command);
        RandomGame.printMessage(ctx, commands);
    }
    
    static initRandomHelper(commandList: CommandObject[], processGameCommand: (ctx: Context, game: Games) => any) {
        RandomGame.commandList = commandList;
        RandomGame.processGameCommand = processGameCommand;
        // The regular expression of the random command must follow the pattern /random0gamea1gameb1gamec2
        const acceptedCommandsForRegexp = commandList.map(item => '(' + item.command + ')').join('|');
        RandomGame.regexp = new RegExp(`/random0((${acceptedCommandsForRegexp})+1)*?(${acceptedCommandsForRegexp})+2`);
    }
    
    static makeToggleKeyboard (commands: string[]) {
        const kb = new ButtonKeyBoardHelper();
        for (const command of RandomGame.commandList) {
            const commandIndex = commands.findIndex(string => command.command === string);
            let newCommandArr = [...commands];
            let currentlyIn: boolean;
            if (commandIndex > -1) {
                newCommandArr.splice(commandIndex, 1);
                currentlyIn = true;
            } else {
                newCommandArr.push(command.command);
                currentlyIn = false;
            }
            kb.addNewButton(command.command + (currentlyIn ? '✅' : '❌'), 'random0' + newCommandArr.join('1') + '2');
        }
        return kb.buttons;
    }

    static printMessage(ctx: Context, commands: string[]) {
        ctx.reply('You can use the buttons bellow to configure your game, once you\'re ready launch your game with the following link\n/random0' +
            commands.join('1') + '2', {reply_markup: {inline_keyboard: RandomGame.makeToggleKeyboard(commands)}});
    }

    static processButtonChange(ctx: Context) {
        const payload = ctx.callbackQuery.data.substring(ctx.callbackQuery.data.indexOf('0') + 1, ctx.callbackQuery.data.indexOf('2'));;
        RandomGame.printMessage(ctx, payload.split('1'));
    }

    static randomCommand(ctx: Context) {
        if (RandomGame.regexp.test(ctx.message.text)) {
            // 0 will define the start of the messag,e 2 the end, and 1 the separator
            const payload =  ctx.message.text.substring(ctx.message.text.indexOf('0') + 1, ctx.message.text.indexOf('2'));
            const possibleGames = payload.split('1');
            const selectedCommand = possibleGames[Math.floor(Math.random() * possibleGames.length)];
            const selectedGame = RandomGame.commandList.find(game => selectedCommand === game.command);
            ctx.message.text = '/' + selectedGame.command;
            RandomGame.processGameCommand(ctx, selectedGame.game);
        }
    }
}