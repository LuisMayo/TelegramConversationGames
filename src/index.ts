import { Conf } from "./conf";
import * as fs from 'fs';
import * as Telegraf from 'telegraf';
import { Rather } from "./games/wouldYouRather/rather.bean";
import { GetGameFromString, Games } from "./games/service-factory";
import { Utils } from "./utils";
import { GeneralService } from "./bot";
import { CommandObject } from "./command-object";
import { RandomGame } from "./random-game";

const confPath = process.argv[2] || './conf';
const conf: Conf = JSON.parse(fs.readFileSync(confPath + '/conf.json', { encoding: 'UTF-8' }));
const bot = new Telegraf.default(conf.token);
const commandList: CommandObject[] = [];
GeneralService.bot = bot;

bot.start(showStart);
bot.catch((err) => {
    console.log('Ooops', err)
})

bot.command('about', ctx => ctx.reply('Bot made with ❤ by @TLuigi003. Check it out on its Github page: https://github.com/LuisMayo/TelegramConversationGames.\n\nDo you like my work? You could thank me by buying me a [ko-fi](https://ko-fi.com/luismayo)', { parse_mode: 'Markdown' }));


bot.command('fmk', ctx => ctx.reply('May you want to play /fmkguys or /fmkgirls ?'));
bot.command('pressthebutton', ctx => ctx.reply('Do you want to play\n/wyptbsafe - A list of verified and moderated questions\n/wyptb - Any question, safe or not. it may include NSFW content\n/wyptbnotsafe - ONLY unchecked questions, it may include NSFW content'));
bot.command('random', RandomGame.initFirstTimeMessage);
bot.command(['contribute', 'donate'], (ctx) => {
    ctx.replyWithInvoice(
        {
            title: 'Support the project',
            currency: 'EUR',
            payload: 'null',
            start_parameter: 'null',
            description: 'Help to keep this project alive with a small contribution',
            provider_token: conf.paymentToken,
            prices: [
                { label: 'Contribution', amount: 100 }
            ],
            //@ts-ignore
            max_tip_amount: 10000,
            suggested_tip_amounts: [100, 200, 500, 1000],
        }
    );
});

registerCommand(0, 'wouldyourather', Games.RATHER, 'rather');
registerCommand(1, 'neverhaveiever', Games.NEVER, 'never');
registerCommand(2, 'tod', Games.TOD);
registerCommand(3, 'truth', Games.TOD);
registerCommand(4, 'dare', Games.TOD);
registerCommand(5, 'fmkguys', Games.FMK, 'fmk');
registerCommand(6, 'fmkgirls', Games.FMK, 'fmk');
registerCommand(7, 'wyptbsafe', Games.PRESSTHEBUTTON, 'pressTheButton');
registerCommand(8, 'wyptb', Games.PRESSTHEBUTTON, 'pressTheButton')
registerCommand(9, 'wyptbnotsafe', Games.PRESSTHEBUTTON, 'pressTheButton')
RandomGame.initRandomHelper(commandList, processGameCommand);

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));
bot.on("successful_payment", (ctx) => ctx.reply('Thanks a lot for contributing with the project. Your help is invaluable <3'));
bot.action(/random.*/, RandomGame.processButtonChange);
bot.action(/.*/, Utils.executeCallback);
bot.use(RandomGame.randomCommand);

function processGameCommand(ctx: Telegraf.Context, game: Games) {
    const date = new Date();
    console.log('[' + date + '] New ' + game + ' command');
    GetGameFromString(game).getGameObject(ctx).then((data: Rather) => {
        data.sendMessage(ctx);
    }).catch((error: Error) => {
        ctx.reply('An error ocurred while trying to get the game\n' + error.name + ': ' + error.message);
    });
}

function registerCommand(id: number | number[], command: string | string[], game: Games, callbackHandle?: string) {
    if (typeof command === 'string') {
        commandList.push({ id: id as number, command: command, game: game });
    } else {
        let i = 0;
        for (const singleCommand of command) {
            commandList.push({ id: id[i], command: singleCommand, game: game });
            i++;
        }
    }
    bot.command(command, ctx => processGameCommand(ctx, game));
    if (callbackHandle) {
        Utils.registerHandler(callbackHandle, GetGameFromString(game).handleCallBack)
    }
}

function showStart(ctx: Telegraf.Context) {
    ctx.reply('Welcome to conversation games bot. Let\'s generate some conversation with your friends. Shall we?\n' +
        'Available games:\n' +
        '/wouldyourather - Gimme a would you rather question\n' +
        '/neverhaveiever - Have you ever done this?\n' +
        '/fmk - Who do you want to fuck, marry and kill?\n' +
        '/tod - Play truth or dare\n' +
        '/truth - Only the "truth" questions of Truth or Dare\n' +
        '/dare - Only the dares\n' +
        '/pressTheButton - Would you press the button?\n' +
        '/random - A random game!');
}
bot.launch();
