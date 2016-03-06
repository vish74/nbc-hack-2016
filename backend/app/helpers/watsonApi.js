//need method that takes an IMDB description as an argument, 
//and returns two JSON objects (1. personality result, 2. tone result)
var request = require('request');
exports.watsonApi = function (req, res) {
    var post_con ={} ;
    post_con["version"]='2016-02-11';
    post_con["text"]=req;
    var dl_url ='https://watson-api-explorer.mybluemix.net/tone-analyzer-beta/api/v3/tone';
    /* tonetest(dl_url,post_con){
     return callback;
     }*/
    request.get({
        url:        dl_url,
        qs:       post_con
    }, function(error, response, body){
        res(body);
    });


};