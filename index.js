// ###                   ###
//!### SETTING IT ALL UP ###
// ###                   ###
// Require dotenv package that will help read API keys from the .env file
// The browser does not support process.env, hence we need dotenv
require('dotenv').config();
// console.log(process.env)

// Require Supabase package by creating a Suparbase Client
const { createClient } = require('@supabase/supabase-js')
// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_API_URL, process.env.SUPABASE_PUBLIC_ANON_API_KEY)

// Require Telegraf package by creating a telegraf object
const {Telegraf} = require('telegraf');
// Educational note:
// Constructor functions generally start with an upper case letter
// You need curly braces here since you're destructuring the object
// read more here - https://stackoverflow.com/questions/38660022/curly-brackets-braces-in-node-js-require-statement

// creating a bot from the telegraf package
const bot = new Telegraf(process.env.BOT_API_KEY);

// ###               ###
//!###  CODE  BEGINS ###
// ###               ###

// ### IDENTIFY USER ###

// Creating function for getting user_id_telegram from supabase
// Use as boolean
const get_user_id_from_supabase = async(user_id) =>  {
    const {data: user_id_supabase , error} = await supabase
        .from('user_details')
        .select('user_id_telegram')
        .eq('id',user_id);
    
    if (error) {
        console.error(error)
        return
    }
    return user_id_supabase
}


// Log user state within the state property of the ctx object
// Educational note:
// next(cxt) passes cxt object the next handler so you can modify properties like `state`
bot.use((ctx, next) =>{
    console.log(ctx.state);
    console.log(`Entered use handler - IsUser: ${ctx.state.isUser}`);
    // check if user already exists
    if (ctx.state.isUser == 1){
        //do nothing
        console.log(`use handler says user exists`)
    } else {
            // TODO same code block also in start command, do something
            // if id is not in table, add it to table
            const insert_user_id = async() => {
                const { data, error } = await supabase
                    .from('user_details')
                    .insert([
                        {
                            user_id_telegram: `${ctx.id}`,
                            username_telegram: ctx.username,
                            first_name_telegram: ctx.first_name,
                            last_name_telegram: ctx.last_name,
                            type_telegram: ctx.type
                        }
                    ])
                if (error) {
                    console.error(error)
                    return
                }
                return data

            }        
            // set ctx state
            insert_user_id().then(res => {
                ctx.state.isUser == 1;
                console.log(`USE HANDLER: user entry added: ${res}`)
            });
    }
    next(ctx);
});

// ### TEXT COMMANDS ###
// Normal text commands handled with `hears`
// NOTE: to user hear in a group chat, disable bot from bot father

//! ### Cookie please
const arrCookiePleasePhrases = [`cookie please`, `cookie`, `cookie plz`,`cookie pls`,
`Cookie please`, `Cookie`,`Cookie plz`, `Cookie pls`]

bot.hears(arrCookiePleasePhrases, (ctx, next) => {
    // creating a wrapping function so we have an async context
    const get_cookie = async() =>  {
        const {data: cookies , error} = await supabase
            .from('cookies')
            .select('text')
            .eq('id','1');
        
        if (error) {
            console.error(error)
            return
        }
        return cookies
    }
        get_cookie().then(cookies => {
        const cookie_string = cookies[0]['text'];
        // Educational note:
        // Use then to perform actions, you can chain then if needed
        ctx.reply(`Cookie:
${cookie_string}`);
        return cookie_string;
    });
    next(ctx);
}) 

//!### Add cookie
// Edu Note: Remember you can use string methods or RegEx methods to do this. Currently using string replace
// Edu Note: In RegEx, i means case insensitive and / something / is a regex literal in ES6
// Array of regular expressions for the handler
let arrAddCookieRegEx = [/^add cookie \b/i, /^add mini cookie \b/i];
arrAddCookieRegEx.push(/^add big cookie \b/i)

// Iterate over each regex to find which trigger worked
bot.hears(arrAddCookieRegEx, (ctx, next) => {
    // to store the extracted matches
    let stringMatches = [];
    // TODO use i to track which expression gave us the match
    // TODO differentiate between cookie types
    arrAddCookieRegEx.forEach((value,i) => {
        const stringMessage= ctx.message.text;
        if (stringMatches.length == 0 && value.test(stringMessage))  {
            // we have a match and have not found a cookie before
            stringMatches.push(stringMessage.replace(value,""));
        }
    })
    // insert cookie to cookies table in Supabase
    const insert_cookie = async() => {
        const { data, error } = await supabase
            .from('cookies')
            .insert([
                {
                text: stringMatches[0],
                // TODO make weight and type customizable based on cookie type
                // weight: ctx.username,
                user_id_telegram: ctx.id
                // type_mini: ;
                // type_custom_1: ;
                // type_custom_2: ;
                // type_custom_3: 
                }
            ])
        if (error) {
            console.error(`Error while inserting cookie: ${error[0]}`);
            return;
        }
        return data;
    }
    insert_cookie().then(data => {
    // send reply
    // Note: Want to send  stringMatches data in ctx.reply
    // hence it was called within async
    console.log(data); 
    // TODO differentiate between cookie types
    ctx.reply(`Cookie added! Great job :)

Cookie:
${stringMatches[0]}`);
    // pass the context only after the data has been submitted
    next(ctx);
    });
});


// ### CORE COMMANDS ###

// Create a handler for the /start command
bot.start((ctx, next) => {
    console.log(`START HANDLER ENTERED`);
    // TODO Check if username is in database
    get_user_id_from_supabase(ctx.id).then(user_id_telegram =>{
        // if the id exists in the supabase table
        if(user_id_telegram == ctx.id){
            ctx.state.isUser = 1;
        } else {
            // if id is not in table, add it to table
            const inser_user_id = async() => {
                const { data, error } = await supabase
                    .from('user_details')
                    .insert([
                        {
                            user_id_telegram: ctx.id,
                            username_telegram: ctx.username,
                            first_name_telegram: ctx.first_name,
                            last_name_telegram: ctx.last_name,
                            type_telegram: ctx.type
                        }
                    ])
            }
        }
    })

    ctx.reply(`
Welcome to your Badass Cookie Jar!
Your wins are cookies.

When you're feeling down, do the following:
Read a cookie.
Feel amazing.
Resume badassery!`,{
        parse_mode: 'Markdown'
    });
    next(ctx);
})

// Create a handler for the /help command
bot.help((ctx, next) => {
    ctx.reply(`
Your wins, big and small, are cookies.
Add them by typing **add cookie**
    
When you're feeling down request a cookie by typing **cookie please**
`);
    next(ctx);
})

// Create a handler for the /settings command
bot.settings((ctx, next) =>{
    ctx.reply(`It's YOUR cookie jar. Set it up how you need it!`);
    next(ctx);
})


// Custom command
//! Currently unused
//TODO Make useful or remove 
bot.command("add", (ctx) => {
    ctx.telegram.sendMessage(ctx.chat.id, `What kind of cookie?`,{
        reply_markup: {
            // array of array of Keyboard Button - https://core.telegram.org/bots/api#keyboardbutton
            keyboard: [
                [
                    // TODO Currently replies with this text
                    // TODO could use switch_inline_query_inline_chat
                    // https://core.telegram.org/bots/api#inlinekeyboardbutton
                    {text: "add mini cookie"},
                    {text: "add cookie"}]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
})


// ### LAUNCH BOT ###
console.log(`##### BOT STARTED #####`)
bot.launch()
