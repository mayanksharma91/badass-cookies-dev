// Require dotenv package that will help read API keys from the .env file
// The browser does not support process.env, hence we need dotenv
require('dotenv').config();
// console.log(process.env)

// Require Telegraf package by creating a telegraf object
const {Telegraf} = require('telegraf');
// Educational note:
// Constructor functions generally start with an upper case letter
// You need curly braces here since you're destructuring the object
// read more here - https://stackoverflow.com/questions/38660022/curly-brackets-braces-in-node-js-require-statement

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
    next(ctx);
})

// Add cookie
bot.hears(`add cookie`, (ctx) => {
    ctx.reply(`Cookie added! Great job :)`);
    next(ctx);
})


// ##########
// CORE COMMANDS
// ##########

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







bot.launch()