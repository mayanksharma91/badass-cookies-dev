
// Menu for when a user presses 'Add cookie' in either mainMenu or helpMenuForStart
function addCookieTypeMenu(bot, ctx){
    const messageString = `Type your cookie.`
    bot.telegram.sendMessage(ctx.chat.id, `${messageString}`, {
        parse_mode: 'Markdown',        
        reply_markup: {
            inline_keyboard: [
                // [
                //     { text: `Just any cookie`, callback_data: `add cookie`}
                // ],
                // [
                //     { text: `Custom 1 cookie`, callback_data: `add custom 1 cookie`},
                //     { text: `Custom 2 cookie`, callback_data: `add custom 2 cookie`},
                //     { text: `Custom 3 cookie`, callback_data: `add custom 3 cookie`}
                // ],
                [
                    { text: `Back to menu`, callback_data: `main menu`}
                ]
            ]
        }
    });
}

function cookiePleaseMenu (bot, ctx, messageString){
    bot.telegram.sendMessage(ctx.chat.id, `${messageString}`, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: `☺`, callback_data: `+1`},
                    // { text: `🙂`, callback_data: `+0`},
                    { text: `😐`, callback_data: `-1`}
                ],
                [
                    { text: `Back to menu`, callback_data: `main menu`}
                ]
            ]
        }
    });
}


function helpMenuForStart(bot, ctx){
    bot.telegram.sendMessage(ctx.chat.id, `Let's get started!`, {
    //? https://telegrambots.github.io/book/2/reply-markup.html 
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: `Add cookie`, callback_data: `add cookie`}
                ],
                [
                    { text: `Cookie please`, callback_data: `cookie please`}
                ]
            ]
        }
    });
}

function mainMenu (bot, ctx, messageString){
    bot.telegram.sendMessage(ctx.chat.id, `${messageString}`, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: `Add cookie`, callback_data: `add cookie`}
                ],
                [
                    { text: `Cookie please`, callback_data: `cookie please`}
                ]
            ]
        }
    });
}

//! UNUSED FUNCTIONS -- Begin
// //* Custom command
// //? For using inline keyboard with callbacks
// //? https://stackoverflow.com/questions/46828965/telegram-bot-inline-keyboard-markup-callback-usage-for-channel-messages
// bot.command(`add`, (ctx, next) => {
//     const stringAddInLine = `Which type of cookie?
// Don't want to categorize? Simply type your cookie!`
//     ctx.telegram.sendMessage(ctx.chat.id, stringAddInLine,{
//         reply_markup: {
//             // array of array of Keyboard Button - https://core.telegram.org/bots/api#keyboardbutton
//             inline_keyboard: [
//                 [
//                     // TODO Currently replies with this text
//                     // TODO could use switch_inline_query_inline_chat
//                     // https://core.telegram.org/bots/api#inlinekeyboardbutton
//                     {text: `add cookie`, callback_data: `add cookie`}
//                 ],
//                 [
//                     {text: `add custom1 cookie`, callback_data: `add custom1 cookie`},
//                     {text: `add custom2 cookie`, callback_data: `add custom2 cookie`},
//                     {text: `add custom3 cookie`, callback_data: `add custom3 cookie`}
//                 ]

//             ],
//             resize_keyboard: true,
//             one_time_keyboard: true
//         }
//     })
//     next(ctx);
// });
//! UNUSED FUNCTIONS -- End

//? EXPORTING MODULES
module.exports = {
    addCookieTypeMenu,
    helpMenuForStart,
    mainMenu,
    cookiePleaseMenu
}