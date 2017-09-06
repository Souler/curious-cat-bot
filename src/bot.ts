import { CuriousCatBot } from './curious-cat-bot';
import * as dotenv from 'dotenv';

dotenv.config();

const telegramToken = process.env['TELEGRAM_BOT_TOKEN'];
const curiouscatToken = process.env['CURIOUSCAT_API_TOKEN'];
const bot = new CuriousCatBot(telegramToken, curiouscatToken);

bot.start();
// Teardown logic
process.on('exit', () => bot.stop())
// Ctrl+c event
process.on('SIGINT', () => process.exit(1));
//Catches uncaught exceptions
process.on('uncaughtException', () => process.exit(1));
