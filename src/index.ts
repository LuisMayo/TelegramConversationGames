import { Conf } from "./conf";
import * as fs from 'fs';
import * as Telegraf from 'telegraf';
import { User } from "telegraf/typings/telegram-types";
import { Rather } from "./games/wouldYouRather/rather.bean";
import { GetGameFromString, Games } from "./games/service-factory";
import { Utils } from "./utils";
import { RatherGameService } from "./games/wouldYouRather/rather-service";
import { BotService } from "./bot";

const confPath = process.argv[2] || './conf';
const conf: Conf = JSON.parse(fs.readFileSync(confPath + '/conf.json', { encoding: 'UTF-8' }));
const bot = new Telegraf.default(conf.token);
BotService.bot = bot;

bot.start(showStart);

bot.command('about', ctx => ctx.reply('Bot made by Luis Mayo. Check it out on its Github page: https://github.com/LuisMayo/TelegramConversationGames'));


bot.command('wouldyourather', ctx => processGameCommand(ctx, Games.RATHER));
bot.action(/.*/, Utils.executeCallback);

function processGameCommand(ctx: Telegraf.Context, game: Games) {
    GetGameFromString(game).getGameObject().then((data: Rather) => {
        data.sendMessage(ctx);
    }).catch((error: Error) => {
        ctx.reply('An error ocurred while trying to get the game\n' + error.name + ': ' +error.message);
    });
}
Utils.registerHandler('rather', RatherGameService.handleCallBack);

function showStart(ctx: Telegraf.Context) {
    ctx.reply('Welcome to conversation games bot. Let\'s generate some conversation with your friends. Shall we?\nAvaiable games:\n/wouldyourather - Gimme a would you rather question');
}
bot.launch();