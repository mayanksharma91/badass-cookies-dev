// Create a custom command
// The command responds to both /test and /Test
bot.command(["test", "Test"], (ctx) => {
    ctx.reply("This is a test command. Yay!");
})