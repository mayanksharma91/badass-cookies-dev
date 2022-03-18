const menus = require("./menus_lib");

//? ### TEXT THAT IS SENT TO USER
const startMessage = `*Welcome to your Badass Cookie Jar!*

Your wins, big and small, are cookies 🍪

When you're feeling down, do the following:
    1️⃣ Ask for a cookie 🍪
    2️⃣ Read cookie and feel amazing 💪
    3️⃣ Resume badassery! 😎
    
Type \`/help\` if you're feeling lost`;

const helpMessage = `Your wins, big and small, are cookies 🍪

*To add a cookie* send:
\`add cookie <cookie text here>\`
Eg. add cookie I had never coded in my life. 3 weeks later, I built this bot!

Felling down? *To request a cookie* send:
\`cookie please\`

Like the 🍪? Send \`+1\` or \`-1\` to modify *how often you see this cookie*.

Add five cookies to get started!`

const cookiePleaseMessageWhenNoCookieAdded = `No cookies added!

*To add a cookie* send:
\`add cookie <cookie text here>\`
Eg. add cookie I had never coded in my life. 3 weeks later, I built this bot!`;


//? ### FUNCTIONS
function getRandomCookie(cookies, ctx, supabase, bot){
    console.log(`length of cookies: ${cookies.length}`)
    // Takes in array of cookie objects and returns a single cookie as string    
    //! Handle error where there is only one cookie:
        //! cookies may not be returned as an array of objects anymore
        if (cookies.length === 0){
            let cookie_string = `${cookiePleaseMessageWhenNoCookieAdded}`;
            ctx.reply(`${cookie_string}`);
            return cookie_string;
        } else {
            // array with cookie_id, will add more cookies to increase 
            // sampling probability of cookies with higher weights
            let arrForSamplingCookieID =[];
            // array to track the index of sampled cookie_id within cookies array
            let arrForCookiesIndex =[];
            cookies.forEach((cookie,i) => {
                for (let j = 0, len = cookie.weight; j < len; j++) {
                    // adding an entry for each weight = 1
                    arrForSamplingCookieID.push(cookie.id);
                    // i is the index in the cookies array 
                    arrForCookiesIndex.push(i);
                }
            })
            let indexForSamplingCookieIDArray = getRandInteger(0, arrForSamplingCookieID.length-1)
            console.log(`sampling index: ${indexForSamplingCookieIDArray}`);
            let cookieIndexToServe = arrForCookiesIndex[indexForSamplingCookieIDArray];
            console.log(`cookie ID: ${cookieIndexToServe}`);
            // set cookie_string
            let cookie_string = cookies[cookieIndexToServe]['text'];
            
            // ### set last_cookie_served in user_details table to cookie_id
            let cookieIDServed = arrForSamplingCookieID[indexForSamplingCookieIDArray];
            // creating a wrapping function so we have an async context
            const writeLastServedCookieID = async() =>  {
            // write new last_served_cookie_id to database 
                const {data: junkData , error} = await supabase
                    .from('user_details')
                    .update({ last_served_cookie_id: cookieIDServed })
                    .eq('user_id_telegram',ctx.from.id);
                
                if (error) {
                    console.error(error)
                    return
                }
                return junkData
            }
            writeLastServedCookieID().then((junkData) => {console.log(`${cookie_string}`)});
            return cookie_string;
        }
}

//* helper function for the /start command
const getUserIDExistsFromSupabase = async(ctx, supabase) =>  {
    // returns count of user_id__telegram from supabase which serves as boolean for user exists
        const { data, error, count } = await supabase
            .from('user_details')
            .select('user_id_telegram', { count: 'exact', head: true })
            .eq('user_id_telegram',ctx.from.id);
        
        if (error) {
            console.error(error)
            return
        } else{
            // console.log(count)
            // console.log(user_id)
            return count
        }
    }


function getRandInteger(min, max) {
    // Returns random integer between min and max, both inclusive
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
 
//* For update cookie weights command
const getLastCookie = async (ctx, supabase) =>  {
    // get cookie by user_id_telegram
        const {data: lastServedCookie , error, count} = await supabase
            .from('user_details')
            .select(`
            last_served_cookie_id,
            cookies!user_details_last_served_cookie_id_fkey (
                weight
            )
            `)
            .eq('user_id_telegram',ctx.from.id);
        
        if (error) {
            console.error(error)
            return
        }
        return lastServedCookie
    }

//* For update cookie weights command
//add the updatedWeight to databse if updatedWeight > 0
const updateCookieWeight = async(lastServedCookie, updatedWeight, supabase) => {
    const { data, error } = await supabase
    .from('cookies')
    .update([
        {
        // text: stringMatches[0],
        weight: updatedWeight
        // user_id_telegram: ctx.from.id
        // type_mini: ;
        // type_custom_1: ;
        // type_custom_2: ;
        // type_custom_3: 
        }
    ])
    .eq(`id`,lastServedCookie[0].last_served_cookie_id)
        if(error){
        console.log(`Error while inserting cookie: ${error}`);
        console.log(error);
        return;
    }
    return data;
}

//? EXPORTING MODULES
module.exports = {
    //*functions 
    getRandomCookie,
    getRandInteger,
    //* messages as constants
    startMessage,
    helpMessage,
    cookiePleaseMessageWhenNoCookieAdded,
    getUserIDExistsFromSupabase,
    getLastCookie,
    updateCookieWeight
};