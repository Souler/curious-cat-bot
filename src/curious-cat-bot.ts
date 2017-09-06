import TelegramBot = require('node-telegram-bot-api');
import * as curiouscat from './types/curious-cat';
import * as telegram from './types/telegram';
import * as adapters from './curiouscat-telegram-adapters';
import { CuriousCatHttpApi } from './curious-cat-http-api';

const COMMAND_POSTS = 'posts';
const COMMAND_ASK = 'ask';

export class CuriousCatBot {
    private bot: TelegramBot;
    private api: CuriousCatHttpApi;

    constructor(telegramToken: string, curiouscatToken: string) {
        this.bot = new TelegramBot(telegramToken, { polling: { autoStart: false } });
        this.api = new CuriousCatHttpApi(curiouscatToken);
        this.bot.on('inline_query', (query: telegram.InlineQuery) => this.processInlineQuery(query));
        this.bot.on('chosen_inline_result', (result: telegram.ChosenInlineResult) => this.processChoosenInlineResult(result));
    }

    start() {
        this.bot.startPolling();
    }

    stop() {
        this.bot.stopPolling();
    }

    protected processQuery(query: string) {
        const [ username, command = '', ...questionParts ] = query.split(' ');
        const question = questionParts.join(' ');
        return { username, command, question }
    }

    protected processInlineQuery(inlineQuery: telegram.InlineQuery) {
        const { id, query } = inlineQuery;
        const { username, command, question } = this.processQuery(query);

        if (!command) // If we only have one argument passed treat it as a useranme search
            return this.answerInlineUsernameSearch(id, username);
        else if (command === COMMAND_POSTS)
            return this.answerInlineUserPosts(id, username);
        else if (command === COMMAND_ASK)
            return this.answerInlineCreatePost(id, username, question);
    }

    protected async answerInlineUsernameSearch(queryId: string, username: string) {
        let users = null;
        if (username)
            users = await this.api.search({ query: username, count: 5 });
        else
            users = await this.api.discoverUsers({ count: 5 });
        return this.bot.answerInlineQuery(queryId, users.map(adapters.fromUserInfoToInlineArticle));
    }

    protected async answerInlineUnknownUsername(queryId: string, username: string) {
        return this.bot.answerInlineQuery(queryId, [], {
            switch_pm_text: `Unknown user ${username}. Try searching?`,
        });
    }

    protected async answerInlineUserPosts(queryId: string, username: string) {
        const user = await this.api.getUserProfile({ username, count: 5 });
        if (!user)
            return this.answerInlineUnknownUsername(queryId, username);
        const posts = user.posts.map(adapters.fromUserPostToInlineArticle);
        return this.bot.answerInlineQuery(queryId, posts);
    }

    protected async answerInlineCreatePost(queryId: string, username: string, question: string) {
        const user = await this.api.getUserProfile({ username, count: 5 });
        if (!user)
            return this.answerInlineUnknownUsername(queryId, username);
        return this.bot.answerInlineQuery(queryId, [ adapters.buildNewQuestionAsInlineQuery(user, question) ]);
    }

    protected async processChoosenInlineResult(result: telegram.ChosenInlineResult) {
        console.log(result);
        const { username, command, question } = this.processQuery(result.query);
        if (command === COMMAND_ASK) {
            const user = await this.api.getUserProfile({ username, count: 0 });
            if (!user)
                return;
            return this.api.sendQuestion({ addressees: String(user.id), question })
        }
    }
}
