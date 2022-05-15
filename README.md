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
--- test /start message order for new user

--- Add ability for user to delete cookie
    --- Can use same flag as cookie please to trigger delete.
    --- Will update a flag called delted in cookies table
    --- Will need to filter deleted cookies before creating sampling array for cookie please

--- create a user_action_log table in supabase:
each row will have:
user.id, telegram_user_id,
time of their message, their message,
bot reply, time of bot reply

---- Set up unicornplatform website
- CTA captures user's name, email and takes user to telegram bot\

---- Buy badass-cookies.com /thetinywins.com
- Point unicornplatform website to this domain

! ### Product Backlog - unprioritized
---- Custom quests
Column in user_details table that specifies number of quests created
Columns for each quest in user_details OR a separate quests table 

---- Change variable name weight to frequency - currently confusing
Ideally higher weight cookies, i.e. more important should be shown less to retain potency
