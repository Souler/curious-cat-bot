import TelegramBot = require('node-telegram-bot-api');
import * as curiouscat from './types/curious-cat';
import * as telegram from './types/telegram';
import * as curiouscatbot from './types/curious-cat-bot';
import * as adapters from './curiouscat-telegram-adapters';
import { CuriousCatHttpApi } from './curious-cat-http-api';

const COMMAND_POSTS = 'posts';
const COMMAND_ASK = 'ask';

export class CuriousCatBot {
    private bot: TelegramBot;
    private api: CuriousCatHttpApi;
    private usesPolling: boolean;

    constructor(options: curiouscatbot.CuriousCatBotConstructorArguments) {
        const { telegram, curiouscat } = options;
        const { token , ...telegramBotOpts } = telegram;
        const _telegramBotOpts = {};

        if (telegramBotOpts.webHook) {
            this.usesPolling = false;
            Object.assign(_telegramBotOpts, {
                webHook: {
                    port: telegramBotOpts.webHook.port,
                },
            })

        } else {
            this.usesPolling = true;
            Object.assign(_telegramBotOpts, {
                polling: { autoStart: false },
            })
        }

        this.bot = new TelegramBot(telegram.token, _telegramBotOpts);
        this.api = new CuriousCatHttpApi(curiouscat.token);
        this.bot.on('inline_query', (query: telegram.InlineQuery) => this.processInlineQuery(query));
        this.bot.on('chosen_inline_result', (result: telegram.ChosenInlineResult) => this.processChoosenInlineResult(result));
    }

    start() {
        if (this.usesPolling)
            return this.bot.startPolling();
        else
            return this.bot.openWebHook();
    }

    stop() {
        if (this.usesPolling)
            return this.bot.stopPolling();
        else
            return this.bot.closeWebHook();
    }

    setWebHook(url: string) {
        return this.bot.setWebHook(url);
    }

    protected async getUsersByUsername(username?: string) {
        let users = null;
        if (username)
            users = await this.api.search({ query: username, count: 5 });
        else
            users = await this.api.discoverUsers({ count: 5 });
        return users;
    }

    protected processQuery(query: string) {
        const [ username, ...params ] = query.split(/\s+/);
        return { username, params }
    }

    protected async processInlineQuery(inlineQuery: telegram.InlineQuery) {
        const { id, query } = inlineQuery;
        const { username, params } = this.processQuery(query);

        const users = await this.getUsersByUsername(username.length >= 3 ? username : '');
        const exactMatchUser = users.find(user =>
            user.username.toLocaleLowerCase() === username.toLocaleLowerCase());

        if (users.length === 0) {
            return this.answerInlineUnknownUsername(id, username);
        }

        if (exactMatchUser) {
            if (params.length === 0)
                return this.answerInlineUserPosts(id, username);
            else
                return this.answerInlineCreatePost(id, username, params.join(' '));
        }

        return this.answerInlineUsernameSearch(id, users);
    }

    protected async answerInlineUsernameSearch(queryId: string, users: curiouscat.UserInfo[]) {
        const userArticles = users.map((user) => adapters.fromUserInfoToInlineArticle(user));
        return this.bot.answerInlineQuery(queryId, userArticles);
    }

    protected async answerInlineUnknownUsername(queryId: string, username: string) {
        return this.bot.answerInlineQuery(queryId, null, {
            switch_pm_text: `Unknown user ${username}.`,
            switch_pm_parameter: 'test',
        });
    }

    protected async answerInlineUserPosts(queryId: string, username: string) {
        const user = await this.api.getUserProfile({ username, count: 5 });
        if (!user)
            return this.answerInlineUnknownUsername(queryId, username);
        const posts = adapters.fromUserPostsToInlineArticles(user, user.posts);
        return this.bot.answerInlineQuery(queryId, posts);
    }

    protected async answerInlineCreatePost(queryId: string, username: string, question: string) {
        const user = await this.api.getUserProfile({ username, count: 5 });
        if (!user)
            return this.answerInlineUnknownUsername(queryId, username);
        return this.bot.answerInlineQuery(queryId, [ adapters.buildNewQuestionAsInlineQuery(user, question) ]);
    }

    protected async processChoosenInlineResult(result: telegram.ChosenInlineResult) {
        const { username, params } = this.processQuery(result.query);
        if (params.length > 0) {
            const question = params.join(' ');
            const user = await this.api.getUserProfile({ username, count: 0 });
            if (!user)
                return;
            return this.api.sendQuestion({ addressees: String(user.id), question })
        }
    }
}
