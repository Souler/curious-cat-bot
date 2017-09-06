import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as ejs from 'ejs';
import * as md5 from 'md5';
import * as curiouscat from './types/curious-cat';
import * as telegram from './types/telegram';
import * as utils from './utils';
import { CuriousCatHttpApi } from './curious-cat-http-api';

const postMessageTemplatePath = resolve(__dirname, './response-templates/post.ejs');
const postMessageTemplate = ejs.compile(readFileSync(postMessageTemplatePath, 'utf8'));
const newPostMessageTemplatePath = resolve(__dirname, './response-templates/new-post.ejs');
const newPostMessageTemplate = ejs.compile(readFileSync(newPostMessageTemplatePath, 'utf8'));

function buildInlineSingleRowKeyboard(buttons: Array<{ text: string, url?: string, switchInlineQuery?: string }>) {
    const buttonsRow = buttons.map((button) => ({
        text: button.text,
        url: button.url,
        switch_inline_query_current_chat: button.switchInlineQuery,
    }));
    return {
        inline_keyboard: [ buttonsRow ],
    }
}

function buildViewProfileInlineKeyboard(user: curiouscat.UserInfo) {
    return buildInlineSingleRowKeyboard([
        { text: `View ${user.username} posts`, switchInlineQuery: `${user.username} ` },
    ]);
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
    const addresseeProfileUrl = CuriousCatHttpApi.getUserProfileUrl(user);
    return {
        id: `user_ask:${user.id}:${md5(question)}`,
        type: 'article',
        title: `Send question to ${user.username}:`,
        description: question,
        input_message_content: {
            parse_mode: telegram.ParseMode.HTML,
            message_text: newPostMessageTemplate({
                addressee: user.username,
                addresseeProfileUrl,
                question,
            }),
        },
        thumb_url: user.avatar,
    }
}

function fromUserPostToInlineArticle(post: curiouscat.UserProfilePost): telegram.InlineQueryResultArticle {
    const postId = post.id;
    const addresseeUsername = post.addresseeData.username;
    const profileUrl = CuriousCatHttpApi.getUserProfileUrl({ username: addresseeUsername });
    const postUrl = CuriousCatHttpApi.getPostUrl({ username: addresseeUsername, postId });
    const senderUsername = (<curiouscat.UserInfo> post.senderData).username || 'Anon';
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
            parse_mode: telegram.ParseMode.HTML,
            message_text: postMessageTemplate({
                sender: senderUsername,
                question: post.comment,
                addressee: addresseeUsername,
                addresseeProfileUrl: profileUrl,
                reply: post.reply,
            }),
        },
        reply_markup: buildViewProfileInlineKeyboard(post.addresseeData),
    }
}

export function fromUserPostsToInlineArticles(
    user: curiouscat.UserProfile,
    posts: curiouscat.UserProfilePost[],
): telegram.InlineQueryResultArticle[] {
    const userArticle = fromUserInfoToInlineArticle(user, {
        title: `Q&A by ${user.username}:`,
        description: `... or keep typing to ask ${user.username} something`,
    });
    const postArticles = user.posts.map(fromUserPostToInlineArticle);
    return [ userArticle, ...postArticles];
}

export function fromUserInfoToInlineArticle(
    user: curiouscat.UserInfo,
    { title, description }: { title?: string, description?: string } = {},
): telegram.InlineQueryResultArticle {
    return             {
        id: `user:${user.id}`,
        type: 'article',
        title: title || user.username,
        description: description || user.askboxtext || `Ask ${user.username} something!`,
        thumb_url: user.avatar,
        input_message_content: {
            message_text: `https://curiouscat.me/${user.username}`,
        },
        reply_markup: buildViewProfileInlineKeyboard(user),
    }
}
