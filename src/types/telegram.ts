export interface User {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
}

export interface Location {
    longitude: number;
    latitude: number;
}

export enum ParseMode {
    MARKDOWN = 'Markdown',
    HTML = 'HTML',
}

export interface InputTextMessageContent {
    /** Text of the message to be sent, 1-4096 characters */
    message_text: string;
    /** Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message. */
    parse_mode?: ParseMode;
    /** Disables link previews for links in the sent message */
    disable_web_page_preview?: boolean;
}

export type InputMessageContent = InputTextMessageContent;

export interface InlineKeyboardMarkup {
    inline_keyboard: Array<Array<InlineKeyboardButton>>;
}

export interface InlineKeyboardButton {
    /** Label text on the button */
    text: string;
    /** HTTP url to be opened when button is pressed */
    url?: string;
    /** Data to be sent in a callback query to the bot when button is pressed, 1-64 bytes */
    callback_data?: string;
    /**
     * If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the
     * bot's username and the specified inline query in the input field. Can be empty, in which case just the bot's
     * username will be inserted.
     *
     * Note: This offers an easy way for users to start using your bot in inline mode when they are currently in a
     * private chat with it. Especially useful when combined with switch_pm… actions – in this case the user will be
     * automatically returned to the chat they switched from, skipping the chat selection screen.
     */
    switch_inline_query?: string;
    /**
     * If set, pressing the button will insert the bot‘s username and the specified inline query in the current chat's
     * input field. Can be empty, in which case only the bot’s username will be inserted.
     * This offers a quick way for the user to open your bot in inline mode in the same chat – good for selecting
     * something from multiple options.
     */
    switch_inline_query_current_chat?: string;
    /**
     * Description of the game that will be launched when the user presses the button.
     *
     * NOTE: This type of button must always be the first button in the first row.
     */
    callback_game?: Object;
    /**
     * Specify True, to send a Pay button.
     * 
     * NOTE: This type of button must always be the first button in the first row.
     */
    pay?: Boolean;
}

export interface InlineQuery {
    id:	string;
    from: User;
    location?: Location;
    query:	string;
    offset:	string;
}

export interface InlineQueryResultArticle {
    /** Type of the result, must be article */
    type: 'article';
    /** Unique identifier for this result, 1-64 Bytes */
    id: string;
    /** Title of the result */
    title: string;
    /** Content of the message to be sent */
    input_message_content: InputMessageContent;
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup;
    /** URL of the result */
    url?: string;
    /** Pass True, if you don't want the URL to be shown in the message */
    hide_url?: Boolean;
    /** Short description of the result */
    description?: string;
    /** Url of the thumbnail for the result */
    thumb_url?: string;
    /** Thumbnail width */
    thumb_width?: number;
    /** Thumbnail height */
    thumb_height?: number;
}

export interface ChosenInlineResult {
    /** The unique identifier for the result that was chosen */
    result_id: string
    /** The user that chose the result */
    from: User
    /** Sender location, only for bots that require user location */
    location?: Location
    /** Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message. Will be also received in callback queries and can be used to edit the message. */
    inline_message_id?: string
    /** The query that was used to obtain the result */
    query: string
}
