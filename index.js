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

// Writing a handler for the /start command
// TODO get Telegram username and check if the user already exists
bot.start((ctx) => {
    // Check if username is in database
    // ctx.botinfo.username 

    // if exists, do nothing
    // if new user, show welcome message
    ctx.reply(`Welcome to your Badass Cookie Jar!
    Your wins, big and small, are cookies.
    Add them by typing add cookie
    When you're feeling down, have a cookie.
    Request a cookie by typign cookie please
    Resume your badassery!`);

})

bot.help((ctx) => {
    ctx.reply(`I'm happy to help!`);
})

bot.settings((ctx) =>{
    ctx.reply(`It's YOUR cookie jar. Set it up how you need it!`);
})

// Create a custom command
// The command responds to both /test and /Test
bot.command(["test", "Test"], (ctx) => {
    ctx.reply("This is a test command. Yay!");
})

bot.launch()