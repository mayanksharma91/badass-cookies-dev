
// ### TEXT THAT IS SENT TO USER
const startMessage = `Welcome to your Badass Cookie Jar!
Your wins are cookies.

When you're feeling down, do the following:
Read a cookie.
Feel amazing.
Resume badassery!`;

const helpMessage = `Your wins, big and small, are cookies.
Add them by typing **add cookie**
    
When you're feeling down request a cookie by typing **cookie please**`

const cookiePleaseMessageWhenNoCookieAdded = `No cookies added!`;

// ### FUNCTIONS
function getRandomCookie(cookies, ctx, supabase){
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
            writeLastServedCookieID().then((junkData) => {console.log(junkData)});
            ctx.reply(`${cookie_string}`);
            return cookie_string;
        }
}


function getRandInteger(min, max) {
    // Returns random integer between min and max, both inclusive
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
 


// EXPORTING MODULES
module.exports = {
    //*functions 
    getRandomCookie,
    getRandInteger,
    //* messages as constants
    startMessage,
    helpMessage,
    cookiePleaseMessageWhenNoCookieAdded
};