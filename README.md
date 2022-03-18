# badass-cookies

## Dependencies
- npm (used 8.5.2)
- nodejs (used v16.14.0)
- supabase-js
- telegraf


## Installations/terminal commands
- `npm init -y`
    - This created the package.json file with some config

- `npm dotenv`
    - Reads in .env file
- Created added node file names to .gitignore using VS code plugin

- `npm install telegraf --save`
    - Installs a package library for Telegram and adds it to the package.json dependencies

- `npm install @supabase/supabase-js`
    - Installs supabase-js and creates a client


## To do list for MVP - prioritized
--- create a user_action_log table in supabase:
each row will have:
user.id, telegram_user_id,
time of their message, their message,
bot reply, time of bot reply

---- Deploy on Herkou
- see youtube video 
- remember to use dotenv (must) and pm2 (optional) 

---- Set up unicornplatform website
- CTA captures user's name, email and takes user to telegram bot\

---- Buy badass-cookies.com /thetinywins.com
- Point unicornplatform website to this domain

! ### Product Backlog - unprioritized
---- Custom quests
Column in user_details table that specifies number of quests created
Columns for each quest in user_details OR a separate quests table 

---- /add command or plain text add cookie command shows inline keyboard with quests
- button press: `add <custom> cookie` is typed in chat for ease of use
---- Change weight to frequency - currently confusing
Ideally higher weight cookies, i.e. more important should be shown less to retain potency
