var Twitter = require('twitter');
var config = require("../../config");

var client = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
});

exports.tweet = function (name,rate) {

var names = name;
var rates = rate;
    var d = new Date();
    var n = d.getSeconds();
    client.post('statuses/update', {status: 'Hey, I am watching #'+names+' ,which is '+rates+'% like me. #Flixer #NBCUHackathon '+n+''}, function (error, tweet, response) {
        if (error) throw error;
        //console.log(tweet);  // Tweet body.
        //console.log(response);  // Raw response object.


    });

};

