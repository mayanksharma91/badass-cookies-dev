function getRandomCookie(cookies, ctx){
    // Takes in array of cookie objects and returns a single cookie as string    
    //! Handle error where there is only one cookie:
        //! cookies may not be returned as an array of objects anymore
        let cookie_string = 'No cookies added!'
        // array with cookie_id, will add more cookies to 
        // increase sampling probability of cookies with higher weights
        let arrForSamplingCookieID =[];
        // array to track the index of samplied cookie_id within cookies array
        let arrForCookiesIndex =[];
        cookies.forEach((cookie,i) => {
            for (let j = 0, len = cookie.weight; j < len; j++) {
                // adding an entry for each weight = 1
                arrForSamplingCookieID.push(cookie.id);
                // i is the index in the cookies array 
                arrForCookiesIndex.push(i);
            }
        })
        indexOfSamplingArray = getRandInteger(0, arrForSamplingCookieID.length-1)
        console.log(`sampling index: ${indexOfSamplingArray}`);
        cookieIDToShow = arrForCookiesIndex[indexOfSamplingArray];
        console.log(`cookie ID: ${cookieIDToShow}`);
        // set cookie_string
        cookie_string = cookies[cookieIDToShow]['text'];
        // Educational note:
        // Use then to perform actions, you can chain then if needed
        ctx.reply(`Cookie:
${cookie_string}`);
    return cookie_string;
}


// Random number function
function getRandInteger(min, max) {
    // Returns random integer between min and max, both inclusive
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// EXPORTING MODULES
module.exports = { getRandomCookie, getRandInteger };