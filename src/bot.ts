import { CuriousCatBot } from './curious-cat-bot';
import * as curiouscatbot from './types/curious-cat-bot';
import * as dotenv from 'dotenv';

dotenv.config();

const conf: curiouscatbot.CuriousCatBotConstructorArguments = {
    telegram: {
        token: process.env['TELEGRAM_BOT_TOKEN'],
    },
    curiouscat: {
        token: process.env['CURIOUSCAT_API_TOKEN'],
    },
}

if (process.env['PORT']) {
    conf.telegram.webHook = {
        port: Number(process.env['PORT']),
    }
}

const bot = new CuriousCatBot(conf);

bot.start();
// Teardown logic
process.on('exit', () => bot.stop())
// Ctrl+c event
process.on('SIGINT', () => process.exit(1));
//Catches uncaught exceptions
process.on('uncaughtException', (e) => {
    console.error(e);
    process.exit(1);
});
