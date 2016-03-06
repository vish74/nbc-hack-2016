var Twitter = require('twitter');
var config = require("../../config");

var client = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
});

client.post('statuses/update', {status: 'Hey, I am watching #BigBangTheory ,which is 76% like me. #Flixer #NBCUHackathon'},  function(error, tweet, response){
        if(error) throw error;
        console.log(tweet);  // Tweet body.
        //console.log(response);  // Raw response object.
    });

