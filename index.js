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
// Educational note:
// Constructor functions generally start with an upper case letter
// You need curly braces here since you're destructuring the object
// read more here - https://stackoverflow.com/questions/38660022/curly-brackets-braces-in-node-js-require-statement

// creating a bot from the telegraf package
const bot = new Telegraf(process.env.BOT_API_KEY);

// reading functions and constants from custom.js
const custom = require("./custom");
// console.log(custom);

// ###               ###
//?###  CODE  BEGINS ###
// ###               ###

// ### IDENTIFY USER ###


// Log user state within the state property of the ctx object
// Educational note:
// next(cxt) passes cxt object the next handler so you can modify properties like `state`
bot.use((ctx, next) =>{
    // console.log(ctx.state);
    // console.log(`Entered use handler - IsUser: ${ctx.state.isUser}`);
    // // check if user already exists
    // if (ctx.state.isUser == 1){
    //     //do nothing
    //     console.log(`use handler says user exists`)
    // } else {
    //         // TODO same code block also in start command, do something
    //         // if id is not in table, add it to table
    //         const insert_user_id = async() => {
    //             const { data, error } = await supabase
    //                 .from('user_details')
    //                 .insert([
    //                     {
    //                         user_id_telegram: ctx.from.id,
    //                         username_telegram: ctx.from.username,
    //                         first_name_telegram: ctx.from.first_name,
    //                         last_name_telegram: ctx.from.last_name,
    //                         type_telegram: ctx.from.type
    //                     }
    //                 ])
    //             if (error) {
    //                 console.error(error)
    //                 return
    //             }
    //             return data

    //         }        
    //         // set ctx state
    //         insert_user_id().then(() => {
    //             ctx.state.isUser == 1;
    //             console.log(`USE HANDLER: user entry added`)
    //         });
    // }
    next(ctx);
});

//? ### TEXT COMMANDS ###
// Normal text commands handled with `hears`
// NOTE: to user hear in a group chat, disable bot from bot father

//? ### Cookie please
const arrCookiePleasePhrases = [`cookie please`, `cookie`, `cookie plz`,`cookie pls`,
`Cookie please`, `Cookie`,`Cookie plz`, `Cookie pls`]

// 
bot.hears(arrCookiePleasePhrases, (ctx, next) => {
    // creating a wrapping function so we have an async context
    const getCookies = async() =>  {
    // get cookie by 
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
    getCookies().then((cookies) => {custom.getRandomCookie(cookies, ctx, supabase)});
    next(ctx);
}) 


//? ### Add cookie
// Edu Note: Remember you can use string methods or RegEx methods to do this. Currently using string replace
// Edu Note: In RegEx, i means case insensitive and / something / is a regex literal in ES6
// Array of regular expressions for the handler
let arrAddCookieRegEx = [/^add cookie \b/i, /^add mini cookie \b/i];
arrAddCookieRegEx.push(/^add mega cookie \b/i)

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
    // console.log(ctx)
    // insert cookie to cookies table in Supabase
    const insert_cookie = async() => {
  
        const { data, error } = await supabase
        .from('cookies')
        .insert([
            {
            text: stringMatches[0],
            // TODO make weight and type customizable based on cookie type
            // weight: ,
            user_id_telegram: ctx.from.id
            // type_mini: ;
            // type_custom_1: ;
            // type_custom_2: ;
            // type_custom_3: 
            }
        ])
         if(error){
            console.log(`Error while inserting cookie: ${error}`);
            console.log(error);
            return;
        }
        return data;
    }
    Promise.all([insert_cookie()]).finally((returnedData) => {
        // send reply
        // Note: Want to send stringMatches data in ctx.reply
        // hence it was called within async
        ctx.reply(`Cookie added! Great job :)

Cookie:
${stringMatches[0]}`);
    // pass the context only after the data has been submitted
    next(ctx);
    });
});

//? ### Change cookie weight


/*
?   ### SLASH COMMANDS ###
/start, /help, /settings are core commands in telegraf
*/
//* helper function for the /start command
const getUserIDExistsFromSupabase = async(user_id) =>  {
    // returns count of user_id__telegram from supabase which serves as boolean for user exists
        const { data, error, count } = await supabase
            .from('user_details')
            .select('user_id_telegram', { count: 'exact', head: true })
            .eq('user_id_telegram',user_id);
        
        if (error) {
            console.error(error)
            return
        } else{
            console.log(count)
            console.log(user_id)
            return count
        }
    }

//* Handler for the /start command
bot.start((ctx, next) => {
        getUserIDExistsFromSupabase(ctx.from.id).then(count =>{
        // TODO if username in database, then set some kind of state variable
        // if(user_id_telegram == ctx.from.id){
            if(count !== 0){
        // do nothing
        } else {
            // if id is not in table, add it to table
            console.log(`count: ${count}`);
            const insert_user_id = async() => {
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
            insert_user_id();
        }
    })
    ctx.reply(`${custom.startMessage}`,{parse_mode: 'Markdown'});
    next(ctx);
})

//* Handler for the /help command
bot.help((ctx, next) => {
    ctx.reply(`${custom.helpMessage}`,{parse_mode: 'Markdown'});
    next(ctx);
})

//* Handler for the /settings command
//! Currently a placeholder
/*  Possible uses:
add custom quests
set custom quest names
*/
bot.settings((ctx, next) =>{
    ctx.reply(`It's YOUR cookie jar. Set it up how you need it!`);
    next(ctx);
})


//* Custom command
//! Currently unused
// bot.command("add", (ctx) => {
//     ctx.telegram.sendMessage(ctx.chat.id, `What kind of cookie?`,{
//         reply_markup: {
//             // array of array of Keyboard Button - https://core.telegram.org/bots/api#keyboardbutton
//             keyboard: [
//                 [
//                     // TODO Currently replies with this text
//                     // TODO could use switch_inline_query_inline_chat
//                     // https://core.telegram.org/bots/api#inlinekeyboardbutton
//                     {text: "add mini cookie"},
//                     {text: "add cookie"}]
//             ],
//             resize_keyboard: true,
//             one_time_keyboard: true
//         }
//     })
// })




// ### LAUNCH BOT ###
console.log(`##### BOT STARTED #####`)
bot.launch()

// checking git

/*
? ### To do list for MVP - prioritized
* --- Randomization of cookie please - DONE
---- Edit cookie weight
- PostgreSQL function to increment weight of latest added cookie for user

---- Deploy on Herkou
- see youtube video 
- remember to use dotenv (must) and pm2 (optional) 

---- Set up unicornplatform website
- CTA captures user's name, email and takes user to telegram bot\

---- Buy badass-cookies.com
- Point unicornplatform website to this domain

! ### Product Backlog - unprioritized
---- Custom quests
Column in user_details table that specifies number of quests created
Columns for each quest in user_details OR a separate quests table 

---- Negative cookie weight - case for negative weights
If negative weight is added and new weight <= 0, then ask user if they want to delete the cookie

---- /add command or plain text add cookie command shows inline keyboard with quests
- button press: `add <custom> cookie` is typed in chat for ease of use
---- Change weight to frequency - currently confusing
Ideally higher weight cookies, i.e. more important should be shown less to retain potency
 
--- create a user_action_log table in supabase:
it will have the user.id, telegram_user_id, time of their message, their message, bot reply stored in a row

*/
