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
//!### CODING BEGINS ###
// ###               ###


// ### IDENTIFY USER ###

// Log user state within the state property of the ctx object
bot.use((ctx, next) =>{
    // TODO check if user already exists
    ctx.state.isUser = 1;
    next(ctx);
})
// Educational note:
// next(cxt) passes cxt object the next handler so you can modify properties like `state`



// ### TEXT COMMANDS ###

// Normal text commands handled be `hears`
// NOTE: to user hear in a group chat, disable bot from bot father

// Request cookie
bot.hears(`cookie please`, (ctx, next) => {
    const get_cookie = async() =>  {
        let {data , error} = await supabase
            .from('cookies')
            .select('text')
            .eq('id','1');
        
            if (error) {
                console.error(error)
                return
            }
        console.log(data)
        return data
    }
    const cookie = get_cookie()
    const cookie_text = JSON.stringify(cookie)
    console.log("cookie_text:" + cookie_text)
    // console.log("Cookie:\n" + cookie_text)
    ctx.reply("Cookie:\n" + cookie_text);
    next(ctx);
}) 

// Add cookie
bot.hears(`add cookie`, (ctx, next) => {
    ctx.reply(`Cookie added! Great job :)`);
    next(ctx);
})


// ### CORE COMMANDS ###

// Create a handler for the /start command
bot.start((ctx, next) => {
    // Check if username is in database
    // ctx.botinfo.username 

    // if exists, do nothing
    // if new user, show welcome message
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
    next(cxt);
})

// Create a handler for the /settings command
bot.settings((ctx, next) =>{
    ctx.reply(`It's YOUR cookie jar. Set it up how you need it!`);
    next(ctx);
})






// ### LAUNCH BOT ###
bot.launch()