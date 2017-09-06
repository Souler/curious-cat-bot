import { CuriousCatBot } from './curious-cat-bot';
import * as curiouscatbot from './types/curious-cat-bot';
import * as dotenv from 'dotenv';

dotenv.config();

const telegramToken = process.env['TELEGRAM_BOT_TOKEN'];
const curiouscatToken = process.env['CURIOUSCAT_API_TOKEN'];
const telegramWebhookPort = process.env['PORT']; // Optional
const telegramWebhookUrl = process.env['TELEGRAM_WEBHOOK_URL']; // Optional

const conf: curiouscatbot.CuriousCatBotConstructorArguments = {
    telegram: { token: telegramToken },
    curiouscat: { token: curiouscatToken },
}

if (telegramWebhookPort) {
    conf.telegram.webHook = {
        port: Number(telegramWebhookPort),
    }
}

const bot = new CuriousCatBot(conf);

if (telegramWebhookUrl) {
    bot.setWebHook(telegramWebhookUrl);
}

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
