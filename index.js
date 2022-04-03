// ###                   ###
//?### SETTING IT ALL UP ###
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
// Educational note: Constructor functions generally start with an upper case letter
// You need curly braces here since you're destructuring the object
// read here - https://stackoverflow.com/questions/38660022/curly-brackets-braces-in-node-js-require-statement

// creating a bot from the telegraf package
// const bot = new Telegraf(process.env.BOT_API_KEY);

// for deploying to heroku
const API_TOKEN = process.env.BOT_API_KEY || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://badass-cookies-dev.herokuapp.com/';

// creating a bot from the telegraf package
const bot = new Telegraf(API_TOKEN,{ polling: true });

bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);

// reading functions and constants from custom_lib.js
const custom = require("./custom_lib");
// reading menu functions from menus_lib.js
const menus = require("./menus_lib.js");
// console.log(custom);

// ###               ###
//?###  CODE  BEGINS ###
// ###               ###

//?   ### SLASH COMMANDS ###
// /start, /help, /settings are core commands in telegraf
//* Handler for the /start command
bot.start((ctx, next) => {
    console.log(`-----> Entered /start`);    
    custom.getUserIDExistsFromSupabase(ctx,supabase).then(count =>{
        if(count !== 0){
            console.log(`user already exists`);
            //* Creating interactive menu
            menus.mainMenu(bot, ctx, custom.startMessage);
            // // killing expectation for cookie text
            // if (ctx.state[0].on_add_cookie === 1) {
            //     custom.updateAddCookieFlag(ctx.from.id, 0, supabase);
            // }
            // // killing expectation of updating cookie weight
            // if (ctx.state[0].on_cookie_please === 1) {
            //     custom.updateCookiePleaseFlag(ctx.from.id, 0, supabase);
            // }
        } else {
            // if id is not in table, add it to table
            console.log(`count: ${count}`);
            const insertUserID = async() => {
                const { data, error } = await supabase
                    .from('user_details')
                    .insert([
                        {
                            user_id_telegram: ctx.from.id,
                            username_telegram: ctx.from.username,
                            first_name_telegram: ctx.from.first_name,
                            last_name_telegram: ctx.from.last_name,
                            type_telegram: ctx.from.type
                        }
                    ])
            }
            
            insertUserID()
            .then(() => {ctx.reply(`${custom.startMessage}`,{parse_mode: 'Markdown'});})
            // .then(() => {ctx.reply(`${custom.helpMessage}`,{parse_mode: 'Markdown'});})           
            //* Creating interactive menu
            .then(() => {menus.helpMenuForStart(bot, ctx);});  
        }
    })
next(ctx);
})

//* Handler for the /help command
bot.help((ctx, next) => {

    try{
        // killing expectation for cookie text
        if (ctx.state[0].on_add_cookie === 1) {
            custom.updateAddCookieFlag(ctx.from.id, 0, supabase);
        }
        // killing expectation of updating cookie weight
        if (ctx.state[0].on_cookie_please === 1) {
            custom.updateCookiePleaseFlag(ctx.from.id, 0, supabase);
        }
    }
    catch (err){
        console.log(err);
    }
    finally{
        menus.mainMenu(bot, ctx,`${custom.helpMessage}`);
        next(ctx);
    }
})

//* Handler for the /settings command
//! /settings placeholder
/*  Possible uses:
add custom quests
set custom quest names
*/
bot.settings((ctx, next) =>{
ctx.reply(`We are working on giving you more control of your cookie jar!`);
next(ctx);
})

//?    ### BOT USE COMMAND   ###
// It reads in user_details from the database and updates ctx.state
// Also, if on_add_cookie flag is set, it adds that message string as a cookie
// and then resets the on_add_cookie flag to 0
// in the future, this functionality will be handled with the scene wizard
// for learning how to use a scene wizard
// https://github.com/telegraf/telegraf/issues/705
// https://github.com/telegraf/telegraf/issues/428
// https://github.com/telegraf/telegraf/issues/221

bot.use((ctx, next) => {
    console.log(`-----> Entered bot.use`);
    custom.readUserDetails(ctx, supabase).then(()=>{
        console.log(ctx.state);
        if (!(typeof ctx.state[0].on_add_cookie === 'undefined')){
            // if a cookie is expected from the user and it was not a callback function call
            if (ctx.state[0].on_add_cookie === 1 && !(typeof ctx.message === 'undefined')){
                // if it was not a slash command 
                const slashRegEx = /^\s*\//g
                if (!slashRegEx.test(ctx.message.text)){
                    // add the cookie
                    custom.insertCookie(ctx.message.text, ctx, supabase)
                    .then(()=>{
                        menus.mainMenu(bot,ctx,`Cookie added!`);
                    })
                    // set on_add_cookie flag and ctx.state to 0 since we no longer expect a cookie
                    .then(()=>{
                        custom.updateAddCookieFlag(ctx.from.id, 0, supabase)
                        .then(()=> {
                            ctx.state[0].on_add_cookie = 0;
                            console.log(`After adding cookie, on_add_cookie flag set to: ${ctx.state[0].on_add_cookie}`);
                        })
                    })
                }
            }
        }
    next(ctx);
    });
})


//?## INLINE MENU ACTIONS- Begin ###
// Educational note:
// next(cxt) passes cxt object the next handler so you can modify properties like `state`
bot.command(`menu`,(ctx, next) =>{
    // killing expectation of updating cookie weight
    try{
        if (ctx.state[0].on_cookie_please === 1) {
        custom.updateCookiePleaseFlag(ctx.from.id, 0, supabase);
        }
    }
    finally{
        //* Creating interactive menu
        menus.mainMenu(bot, ctx, `Main Menu`)
        next(ctx);
    }
});

//* Add cookie
//? pass data into callback action
//? https://stackoverflow.com/questions/63991174/telegraf-js-pass-data-from-button-to-a-function-that-handle-a-wizardscene

bot.action(`add cookie`, (ctx, next) =>{
    // deletes last message we sent
    // ctx.deleteMessage();
    console.log(`-----> Entered bot.action(add cookie)`);
    console.log(`In bot.action add cookie, state is:`);
    console.log(ctx.state[0]);
    ctx.answerCbQuery();
    //TODO add code to set addCookie flag in database = 1
    custom.updateAddCookieFlag(ctx.from.id, 1, supabase)
    .then(() => {
        //* Creating interactive menu
        menus.addCookieTypeMenu(bot, ctx);
        console.log(`bot.action(add cookie) has state:`);
        console.log(ctx.state[0]);
    })
    .catch(error => alert(error.message));     
    next(ctx);
})

//* Main Menu - Interactive
bot.action(`main menu`, (ctx, next) =>{
    // deletes last message we sent
    // ctx.deleteMessage();
    ctx.answerCbQuery();
    custom.updateAddCookieFlag(ctx.from.id, 0, supabase)
    .then(()=>{
        //* Creating interactive menu
        menus.mainMenu(bot, ctx, `What do you want to do?`);
    })
    .catch(error => alert(error.message));   
    next(ctx);
})

//* Cookie please button action
bot.action(`cookie please`, (ctx, next) =>{
    // killing expectation for cookie text
    if (ctx.state[0].on_add_cookie === 1) {
        custom.updateAddCookieFlag(ctx.from.id, 0, supabase);
    }
    
    // ctx.deleteMessage();
    // creating a wrapping function so we have an async context
    const getCookies = async() =>  {
    // get cookie by user_id_telegram
        const {data: cookies , error, count} = await supabase
            .from('cookies')
            .select(`id,text,weight,user_id_telegram`)
            .eq('user_id_telegram',ctx.from.id);
        
        if (error) {
            console.error(error)
            return
        }
        return cookies
    }

    // get a random cookie from the array of cookie objects
    // set cookiePlease Flag to 1 so we expect an update of weights
    getCookies().then((cookies) => {
        const cookieString = custom.getRandomCookie(cookies, ctx, supabase);
        menus.cookiePleaseMenu(bot, ctx, cookieString);
        ctx.answerCbQuery();
    })
    .then(()=> {
        custom.updateCookiePleaseFlag(ctx.from.id, 1, supabase);
    });
    next(ctx);
})

//* Update weight after cookie please action
//* +1
bot.action(`+1`, (ctx, next) =>{
    // Check if we actually expect a response to update the weight
    if (ctx.state[0].on_cookie_please === 1){
        custom.getLastCookie(ctx, supabase)
        .then((lastServedCookie) => {
            let updatedWeight = Number(lastServedCookie[0]['cookies']['weight']) + 1;
            custom.updateCookieWeight(lastServedCookie, updatedWeight, supabase)
            .then(() => {
                menus.mainMenu(bot, ctx, `Great!
This cookie will be shown more often.`)
                console.log(`Cookie weight increased.`)
            })
            .then(()=>{
                custom.updateCookiePleaseFlag(ctx.from.id, 0, supabase)
            })
            .then(()=> {
                ctx.state[0].on_cookie_please = 0;
                console.log(`After adding cookie, on_cookie_please flag set to: ${ctx.state[0].on_cookie_please}`);
            });       
        });
    } else if (ctx.state[0].on_cookie_please === 0){
        menus.mainMenu(bot, ctx, `Please change the frequency the next time you see this cookie 🙂.`);
    }  
    ctx.answerCbQuery();
    next(ctx);
});

//* Update weight after cookie please action
//* -1
bot.action(`-1`, (ctx, next) =>{
    // Check if we actually expect a response to update the weight
    if (ctx.state[0].on_cookie_please === 1){
        custom.getLastCookie(ctx, supabase).then((lastServedCookie) => {
            const currentWeightOfLastServedCookie = Number(lastServedCookie[0]['cookies']['weight']) 
            // do things if weight > 1
            if (currentWeightOfLastServedCookie > 1){
                let updatedWeight = Number(lastServedCookie[0]['cookies']['weight']) - 1;
                custom.updateCookieWeight(lastServedCookie, updatedWeight, supabase)
                .then(() => {
                    menus.mainMenu(bot, ctx, `This cookie will be shown less often.`)                
                    console.log(`Cookie weight decreased.`)
                })
                .then(()=>{
                    custom.updateCookiePleaseFlag(ctx.from.id, 0, supabase)
                })
                .then(()=> {
                    ctx.state[0].on_cookie_please = 0;
                    console.log(`After updating cookie weight, on_cookie_please flag set to: ${ctx.state[0].on_cookie_please}`);
                });                 
            }
            // do nothing except set updateCookiePleaseFlag to 0
            else {
                custom.updateCookiePleaseFlag(ctx.from.id, 0, supabase);
                console.log(`Cookie weight already 1.`)
                menus.mainMenu(bot,ctx,`This cookie is already at lowest frequency.
The ability to delete cookies will be added in the future 🙂\n`);
            }       
        });
    } else if (ctx.state[0].on_cookie_please === 0){
        menus.mainMenu(bot,ctx,`Please change the frequency the next time you see this cookie.`)
    }  
    ctx.answerCbQuery();
    next(ctx);
});

//?## INLINE MENU ACTIONS- End ###

//? ### TEXT COMMANDS ###
// Normal text commands handled with `hears`
// NOTE: to user hear in a group chat, disable bot from bot father

//* ### Cookie please command
const arrCookiePleasePhrases = [`cookie please`, `cookie`, `cookie plz`,`cookie pls`,
`Cookie please`, `Cookie`,`Cookie plz`, `Cookie pls`]

bot.hears(arrCookiePleasePhrases, (ctx, next) => {
    // ctx.deleteMessage();
    // creating a wrapping function so we have an async context
    const getCookies = async() =>  {
    // get cookie by user_id_telegram
        const {data: cookies , error, count} = await supabase
            .from('cookies')
            .select(`id,text,weight,user_id_telegram`)
            .eq('user_id_telegram',ctx.from.id);
        
        if (error) {
            console.error(error)
            return
        }
        return cookies
    }

    // get a random cookie from the array of cookie objects
    getCookies().then((cookies) => {
        const cookieString = custom.getRandomCookie(cookies, ctx, supabase);
        menus.cookiePleaseMenu(bot, ctx, cookieString);
    });
    next(ctx);
}) 


//* ### Add cookie command
// Edu Note: Remember you can use string methods or RegEx methods to do this. Currently using string replace
// Edu Note: In RegEx, i means case insensitive and / something / is a regex literal in ES6

// Array of regular expressions for the handler
let arrAddCookieRegEx = [/^add cookie \b/i, /^add mini cookie \b/i, /^add mega cookie \b/i];
// Iterate over each regex to find which trigger worked
bot.hears(arrAddCookieRegEx, (ctx, next) => {
    // to store the extracted matches
    let stringMatches = [];
    // store message sent by user
    const stringMessage = ctx.message.text;
    // TODO use i to track which expression gave us the match
    // TODO differentiate between cookie types
    arrAddCookieRegEx.forEach((regEx,i) => {
        if (stringMatches.length == 0 && regEx.test(stringMessage))  {
            // we have a match and since the array's length is 0, we have not added a cookie yet
            stringMatches.push(stringMessage.replace(regEx,""));
        }
    })
    // add cookie
    custom.insertCookie(stringMatches[0], ctx, supabase).finally((returnedData) => {
    ctx.reply(`Cookie added! Great job :)
Cookie:
${stringMatches[0]}`);
    // pass the context only after the data has been submitted
    next(ctx);
    });
});


// *   ### Update cookie weight command
// Array of regular expressions for the handler generated here: https://regexr.com/
// bot.hears does not accept an array of objects. This is just for documentation
// All cases allow for whitespaces and end of string
//TODO allow for whitespace in the beginning by adding \s* after
// let arrUpdateWeightRegExObjects = [
//     {regEx: /^\+[1-9]+\d*\s*/,          does: 'positive'},
//     {regEx: /^\-[1-9]+\d*\s*/,          does: 'negative'},
//     {regEx: /^\+0+\s*|^\-0+\s*|\+\s*$|^\-\s*$/,  does: 'zero'}
// ]
let arrUpdateWeightRegEx = [/^\+[1-9]+\d*\s*/, /^\-[1-9]+\d*\s*/, /^\+0+\s*|^\-0+\s*|^\+\s*$|^\-\s*$/];
bot.hears(arrUpdateWeightRegEx,(ctx, next) => {
    custom.getLastCookie(ctx, supabase).then((lastServedCookie) => {
        console.log(lastServedCookie);
        // remove all whitespace acorss the string
        const stringMessage = ctx.message.text.replace(/\s/g, "");
        let change = 0;
        const currentWeightOfLastServedCookie = Number(lastServedCookie[0]['cookies']['weight']);
        let updatedWeight = Number(lastServedCookie[0]['cookies']['weight']);
        console.log(`updated weight initialized to ${updatedWeight}`)
        
        // Iterate over each regex to find which trigger worked
        arrUpdateWeightRegEx.forEach((regEx,i) => {
            // handle absurd zero case
            if (regEx.test(stringMessage) && i === 2){
                // return silly message
                ctx.reply(`That's a badass message but you can't really do that.`)
            } // handle valid cases
            else {
                change = Number(stringMessage.match(regEx));
                updatedWeight = Number(currentWeightOfLastServedCookie) + Number(change);
                // weight can never be negative or zero
                if (updatedWeight <= 0){
                    ctx.reply(`Cookie weighs ${currentWeightOfLastServedCookie} and can't weigh ${updatedWeight}.
The ability to delete cookies will be added in the future.`);
                } //handle positive case
                else if (regEx.test(stringMessage) && i === 0){
                    // reply with message saying weight increased
                    custom.updateCookieWeight(lastServedCookie, updatedWeight, supabase).then(() => {
                        console.log(`Cookie weight increased.`)
                    });
                    ctx.reply(`Weight increased from ${currentWeightOfLastServedCookie} to ${updatedWeight}`);
                } // handle valid negative case
                else if (regEx.test(stringMessage) && i === 1 && updatedWeight > 0){
                    custom.updateCookieWeight(lastServedCookie, updatedWeight, supabase).then(() => {
                        console.log(`Cookie weight decreased.`)
                    });
                    ctx.reply(`Weight reduced from ${currentWeightOfLastServedCookie} to ${updatedWeight}`);
                }
            }
        }); // foreach ends
    }); // then ends
    next(ctx);
});


// 
// bot.command('deleteKeyboardMarkup', (ctx,next) => {
//     bot.telegram.sendMessage(ctx.chat.id, `Keyboard Markup Deleted`, {
//         parse_mode: 'Markdown',
//         reply_markup: {remove_keyboard: true}});
//     next(ctx);
// });

// ### LAUNCH BOT ###
console.log(`##### BOT STARTED #####`)

// Educational: bot.startPolling() can't work with webhooks. Only one of the two works.
bot.launch()
// graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


