import { Conf } from "./conf";
import * as fs from 'fs';
import * as Telegraf from 'telegraf';
import { User } from "telegraf/typings/telegram-types";
import { Rather } from "./games/wouldYouRather/rather.bean";
import { GetGameFromString, Games } from "./games/service-factory";
import { Utils } from "./utils";
import { RatherGameService } from "./games/wouldYouRather/rather-service";
import { GeneralService } from "./bot";
import { NeverGameService } from "./games/neverHaveIEver/never-service";
import { FMKGameService } from "./games/fmk/fmk-service";

const confPath = process.argv[2] || './conf';
const conf: Conf = JSON.parse(fs.readFileSync(confPath + '/conf.json', { encoding: 'UTF-8' }));
const bot = new Telegraf.default(conf.token);
GeneralService.bot = bot;

bot.start(showStart);

bot.command('about', ctx => ctx.reply('Bot made by Luis Mayo. Check it out on its Github page: https://github.com/LuisMayo/TelegramConversationGames'));


bot.command('wouldyourather', ctx => processGameCommand(ctx, Games.RATHER));
bot.command('neverhaveiever', ctx => processGameCommand(ctx, Games.NEVER));
bot.command('tod', ctx => processGameCommand(ctx, Games.TOD));
bot.command('truth', ctx => processGameCommand(ctx, Games.TOD));
bot.command('dare', ctx => processGameCommand(ctx, Games.TOD));
bot.command('fmk', ctx => ctx.reply('May you want to play /fmkguys or /fmkgirls ?'));
bot.command('fmkguys', ctx => processGameCommand(ctx, Games.FMK));
bot.command('fmkgirls', ctx => processGameCommand(ctx, Games.FMK));
bot.action(/.*/, Utils.executeCallback);
Utils.registerHandler('rather', RatherGameService.instance.handleCallBack);
Utils.registerHandler('never', NeverGameService.instance.handleCallBack);
Utils.registerHandler('fmk', FMKGameService.instance.handleCallBack);

function processGameCommand(ctx: Telegraf.Context, game: Games) {
	const date = new Date();
    console.log('[' + date + '] New ' + game + ' command');
    GetGameFromString(game).getGameObject(ctx).then((data: Rather) => {
        data.sendMessage(ctx);
    }).catch((error: Error) => {
        ctx.reply('An error ocurred while trying to get the game\n' + error.name + ': ' +error.message);
    });
}

function showStart(ctx: Telegraf.Context) {
    ctx.reply('Welcome to conversation games bot. Let\'s generate some conversation with your friends. Shall we?\nAvaiable games:\n/wouldyourather - Gimme a would you rather question\n/neverhaveiever - Have you ever done this?\n/fmk - Who do you want to fuck, marry and kill?');
}
bot.launch();