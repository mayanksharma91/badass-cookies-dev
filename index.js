// Require dotenv package that will help read API keys from the .env file
// The browser does not support process.env, hence we need dotenv
require('dotenv').config()
console.log(process.env)  // remove this after you've confirmed it working

// Require Telegraf package by creating a telegraf object
const Telegraf = require('telegraf')

// creating a bot from the telegraf package
const bot = new Telegraf('$BOT_API_KEY')

// middleware
bot.use((ctx) => {
    ctx.reply("Welcome to your Badass Cookie Jar!")
})


bot.launch()