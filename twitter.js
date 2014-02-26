// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));


exports.postToTwitter = function(memoirTitle){
    
    console.log("Posting title: " + memoirTitle);
    T.post('statuses/update', { status: memoirTitle }, function(error, response){
        if(error)
            console.log("Error posting memoir title to twitter " + error);
        if(response)
            console.log("Successfully posted " + memoirTitle + " to Twitter");
    });
}