import * as md5 from 'md5';
import * as curiouscat from './types/curious-cat';
import * as telegram from './types/telegram';
import * as utils from './utils';
import { CuriousCatHttpApi } from './curious-cat-http-api';

export function buildInlineSingleRowKeyboard(buttons: Array<{ text: string, url?: string, switchInlineQuery?: string }>) {
    const buttonsRow = buttons.map((button) => ({
        text: button.text,
        url: button.url,
        switch_inline_query_current_chat: button.switchInlineQuery,
    }));
    return {
        inline_keyboard: [ buttonsRow ],
    }
}

export function buildNewQuestionMarkdownText(addressee: string, question: string) {
    addressee = utils.markdownEscape(addressee);
    question = utils.markdownEscape(question);
    return [
        `I just asked ${addressee}`,
        `*${question}*`,
    ].join('\r\n');
}

export function buildUnknownUserReply(username: string) {
    return {
        id: `user_unknown:${username}`,
        type: 'article',
        title: `Unknown user: ${username}`,
        description: `Could't find user ${username}, did you write the name correctly?`,
        thumb_url: 'https://pbs.twimg.com/profile_images/836960806109589505/15hOnhEy_400x400.jpg',
    }
}

export function buildNewQuestionAsInlineQuery(user: curiouscat.UserInfo, question: string) {
    console.log(buildNewQuestionMarkdownText(user.username, question))
    return {
        id: `user_ask:${user.id}:${md5(question)}`,
        type: 'article',
        title: `Ask ${user.username}`,
        description: question,
        input_message_content: {
            parse_mode: telegram.ParseMode.MARKDOWN,
            message_text: buildNewQuestionMarkdownText(user.username, question),
        },
        thumb_url: user.avatar,
    }
}

export function fromUserPostToMarkdownText(post: curiouscat.UserProfilePost): string {
    const question = utils.markdownEscape(post.comment);
    const reply = utils.markdownEscape(post.reply);
    return [
        `*${question}*`,
        '',
        `${reply}`,
    ].join('\r\n');
}

export function fromUserPostToInlineArticle(post: curiouscat.UserProfilePost): telegram.InlineQueryResultArticle {
    const postId = post.id;
    const addresseeUsername = post.addresseeData.username;
    const profileUrl = CuriousCatHttpApi.getUserProfileUrl({ username: addresseeUsername });
    const postUrl = CuriousCatHttpApi.getPostUrl({ username: addresseeUsername, postId });
    const senderAvatar = post.senderData.avatar;

    return {
        id: `post:${postId}`,
        type: 'article',
        title: `${post.comment}`,
        description: `${post.reply}`,
        url: postUrl,
        hide_url: true,
        thumb_url: `${senderAvatar}`,
        input_message_content: {
            parse_mode: telegram.ParseMode.MARKDOWN,
            message_text: fromUserPostToMarkdownText(post),
        },
        reply_markup: buildInlineSingleRowKeyboard([
            { text: 'Profile', url: profileUrl },
            { text: 'Post', url: postUrl },
        ])
    }
}

export function fromUserInfoToInlineArticle(user: curiouscat.UserInfo): telegram.InlineQueryResultArticle {
    return             {
        id: `user:${user.id}`,
        type: 'article',
        title: user.username,
        description: user.askboxtext || `Ask ${user.username} something!`,
        thumb_url: user.avatar,
        input_message_content: {
            message_text: `https://curiouscat.me/${user.username}`,
        },
        reply_markup: buildInlineSingleRowKeyboard([
            { text: 'Ask', switchInlineQuery: `${user.username} ask ` },
            { text: 'Posts', switchInlineQuery: `${user.username} posts ` },
        ]),
    }
}
