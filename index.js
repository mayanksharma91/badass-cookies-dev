// Require dotenv package that will help read API keys from the .env file
// The browser does not support process.env, hence we need dotenv
require('dotenv').config();
// console.log(process.env)

// Require Telegraf package by creating a telegraf object
// Constructor functions generally start with an upper case letter
// TODO understand why we need the curly braces in const {Telegraph}
const {Telegraf} = require('telegraf');

// creating a bot from the telegraf package
const bot = new Telegraf(process.env.BOT_API_KEY);

// ##########
// NOTES
// passing next allows the ctx object ot be passed from one handler to the next
// you can then modify the object like adding states to its `state` prperty
// ##########

// Log user state within the state property of the ctx object
bot.use((ctx, next) =>{
    // TODO check if user already exists
    ctx.state.isUser = 1;
    next(ctx);
})

// ##########
// TEXT COMMANDS - HEARS
// These commands are in normal text using hears
// NOTE: if I want hears to work in a group chat,
// I need to disable privacy for the bot from bot father
// ##########

// Request cookie
bot.hears(`cookie please`, (ctx) => {
    ctx.reply(`Cookie:
    You did a gereat job with xyz!`);
    next
})

// Add cookie
bot.hears(`add cookie`, (ctx) => {
    ctx.reply(`Cookie added! Great job :)`);
})


// ##########
// CORE COMMANDS
// I have not configured them to pass on ctx to the next handler
// Hence, they are at the end of our script
// ##########

// Create a handler for the /start command
bot.start((ctx) => {
    // Check if username is in database
    // ctx.botinfo.username 

    // if exists, do nothing
    // if new user, show welcome message
    ctx.reply(`
    Welcome to your Badass Cookie Jar!
    Your wins, big and small, are cookies.
    Add them by typing **add cookie**
    
    When you're feeling down request a cookie by typing **cookie please**
    
    Read cookie.
    Feel amazing.
    Resume badassery!`,{
        parse_mode: 'MarkdownV2'
    });

})

// Create a handler for the /help command
bot.help((ctx) => {
    ctx.reply(`I'm happy to help!`);
})

// Create a handler for the /settings command

bot.settings((ctx) =>{
    ctx.reply(`It's YOUR cookie jar. Set it up how you need it!`);
})







bot.launch()