//models
var User = require('./app/models/user');
var Show = require('./app/models/show');
var watson = require('./app/helpers/watsonApi');
var tw = require('./app/helpers/twitterApi');
var ingestion = require('./app/helpers/show-ingestion');

//web routes
exports.index = function(req, res) {
    res.render('../app/views/index');
};

exports.admin = function(req, res) {
    User.find(function(err, users){
        if(err){console.log('err: ', err)}
        Show.find(function(err, shows){
            if(err){console.log('err: ', err)}
            res.render('../app/views/admin', {
                users: users,
                shows: shows
            });
        });
    });
};

exports.editShow = function(req, res){
    Show.findOne({"_id": req.params.show_id}, function(err, show){
        res.render('../app/views/editShow', {
            show: show
        });
    });
}

exports.updateShow = function(req, res){
    Show.findOne({"_id": req.params.show_id}, function(err, show){
        for (prop in req.body){
            if(req.body[prop] != ''){
                show[prop] = req.body[prop];
            }
        }
        show.save(function(err, show){
            if(err){console.log('err: ', err)}
            res.redirect('/admin/show/edit/' + req.params.show_id);
        })
    });
}


//direct run routes
exports.testWatson = function(req, res){
    var watsonApi = require('./app/helpers/watsonApi');

    ingestion.showsJSON1.forEach(function(show){
        var text = show.description;
        // console.log('text: ', text)
        var rawShow = show;

        testWatson = function(watsonCallback){
            watsonApi.tone(text, watsonCallback);
        }

        testWatson(function(body){
            var parsedBody = JSON.parse(body);
            console.log('parsedBody: ', parsedBody);

            if(parsedBody.error){return}

            var rawTone = {};
            parsedBody.document_tone.tone_categories[0].tones.forEach(function(tone){
                rawTone[tone.tone_id] = tone.score;
            });
            parsedBody.document_tone.tone_categories[1].tones.forEach(function(tone){
                rawTone[tone.tone_id] = tone.score;
            });

            var rawPersonality = {};
            parsedBody.document_tone.tone_categories[2].tones.forEach(function(tone){
                rawPersonality[tone.tone_id.slice(0, -5)] = tone.score;
            });

            var processedTone = {
                "dark": (rawTone.fear + rawTone.sadness + rawTone.disgust + rawTone.anger)/4,
                "inspiring": (rawTone.joy + rawTone.fear + rawPersonality.openness + rawTone.confident)/4,
                "feel_good": (rawTone.joy + rawPersonality.extraversion + rawPersonality.agreeableness)/3,
                "quirky": (rawTone.joy + rawPersonality.openness + rawPersonality.neuroticism)/3,
                "emotional": (rawTone.joy + rawTone.sadness + rawTone.anger + rawPersonality.agreeableness + rawTone.analytical + rawPersonality.conscientiousness)/6,
                "funny": (rawTone.joy + rawTone.anger + rawPersonality.agreeableness + rawTone.confident)/4,
                "cerebral": (rawTone.joy + rawTone.anger + rawTone.disgust + rawTone.analytical + rawPersonality.neuroticism + rawPersonality.conscientiousness)/6,
                "suspenseful": (rawTone.joy + rawTone.disgust + rawPersonality.neuroticism + rawPersonality.openness + rawTone.tentative)/5,
                "exciting": (rawTone.joy + rawTone.fear + rawPersonality.openness + rawTone.confident + rawTone.tentative)/5
            };

            var toneThreshold = .35; //values below this should be considered false, and at or above true
            var toneBooleans = {};

            for (prop in processedTone){
                if(processedTone[prop] < toneThreshold){
                    toneBooleans[prop] = false;
                }else{
                    toneBooleans[prop] = true;
                }
            }

            var show = new Show({
                name: rawShow.name,
                description: rawShow.description,
                personality: JSON.stringify(rawPersonality),
                tone: JSON.stringify(toneBooleans),
                picURL: rawShow.picURL,
                episodeDuration: rawShow.episodeDuration,
                numberOfSeasons: rawShow.numberOfSeasons,
                whereToWatch: rawShow.whereToWatch
            });

            show.save(function(err, savedShow){
                if(err){
                    console.log('err: ', err);
                }
                console.log('savedShow: ', savedShow);
                // res.send(savedShow);
            });
        });
    });
    res.send('might have processed your data');
}

    //SPLIT ------=========-------======~~~~~~~~~~~~~~========--------

    // var text = "NBC will debut Howie Mandel's \"Take It All\" (formerly \"Howie Mandel's White Elephant\"), an exciting new game show, to be stripped throughout the holiday week of December 10-14 (9:00-10:00 p.m. ET all nights) and to conclude on Monday, December 17.\r\n\r\nIn the show, a contestant selects and opens a prize worth thousands of dollars: dream prizes such as luxury cars, exotic trips, jewelry and VIP experiences. Then, the next player is faced with a dilemma: do they steal a prize that has already been revealed, or do they take a chance with another unopened prize, hoping what's inside is worth more?\r\n\r\nBut that's just the beginning. When there are only two contestants left, the players have a life-changing choice to make: keep the prizes they have - or try to take all the prizes. If both players choose to \"keep mine,\" they will each keep the prizes they have won in the prior rounds. If one player chooses \"keep mine\" and the other chooses to \"take it all,\" the player that chose \"take it all\" will go home with all the prizes - theirs and their opponents. But if both choose \"take it all,\" they both go home with nothing. The stakes are insanely high as each contestant grapples with the choice of a lifetime.\r\n\r\n\"Take It All\" is from Universal Television and Alevy Productions. Mandel (NBC's \"America's Got Talent\"), Scott St. John and Mike Marks are the executive producers."

    // var rawShow = {
    //     "name": "Take It All",
    //     "description": "NBC will debut Howie Mandel's \"Take It All\" (formerly \"Howie Mandel's White Elephant\"), an exciting new game show, to be stripped throughout the holiday week of December 10-14 (9:00-10:00 p.m. ET all nights) and to conclude on Monday, December 17.\r\n\r\nIn the show, a contestant selects and opens a prize worth thousands of dollars: dream prizes such as luxury cars, exotic trips, jewelry and VIP experiences. Then, the next player is faced with a dilemma: do they steal a prize that has already been revealed, or do they take a chance with another unopened prize, hoping what's inside is worth more?\r\n\r\nBut that's just the beginning. When there are only two contestants left, the players have a life-changing choice to make: keep the prizes they have - or try to take all the prizes. If both players choose to \"keep mine,\" they will each keep the prizes they have won in the prior rounds. If one player chooses \"keep mine\" and the other chooses to \"take it all,\" the player that chose \"take it all\" will go home with all the prizes - theirs and their opponents. But if both choose \"take it all,\" they both go home with nothing. The stakes are insanely high as each contestant grapples with the choice of a lifetime.\r\n\r\n\"Take It All\" is from Universal Television and Alevy Productions. Mandel (NBC's \"America's Got Talent\"), Scott St. John and Mike Marks are the executive producers.",
    //     "whereToWatch": "http://www.nbc.com/take-it-all/",
    //     "picURL": "http://content.internetvideoarchive.com/content/photos/8153/87179_hqdefault.jpg",
    //     "episodeDuration": 60,
    //     "numberOfSeasons": 4
    // };

    // testWatson = function(watsonCallback){
    //     watsonApi.tone(text, watsonCallback);
    // }

    // testWatson(function(body){
    //     var parsedBody = JSON.parse(body);
    //     console.log('parsedBody: ', parsedBody);

    //     var rawTone = {};
    //     parsedBody.document_tone.tone_categories[0].tones.forEach(function(tone){
    //         rawTone[tone.tone_id] = tone.score;
    //     });
    //     parsedBody.document_tone.tone_categories[1].tones.forEach(function(tone){
    //         rawTone[tone.tone_id] = tone.score;
    //     });

    //     var rawPersonality = {};
    //     parsedBody.document_tone.tone_categories[2].tones.forEach(function(tone){
    //         rawPersonality[tone.tone_id.slice(0, -5)] = tone.score;
    //     });

    //     var processedTone = {
    //         "dark": (rawTone.fear + rawTone.sadness + rawTone.disgust + rawTone.anger)/4,
    //         "inspiring": (rawTone.joy + rawTone.fear + rawPersonality.openness + rawTone.confident)/4,
    //         "feel_good": (rawTone.joy + rawPersonality.extraversion + rawPersonality.agreeableness)/3,
    //         "quirky": (rawTone.joy + rawPersonality.openness + rawPersonality.neuroticism)/3,
    //         "emotional": (rawTone.joy + rawTone.sadness + rawTone.anger + rawPersonality.agreeableness + rawTone.analytical + rawPersonality.conscientiousness)/6,
    //         "funny": (rawTone.joy + rawTone.anger + rawPersonality.agreeableness + rawTone.confident)/4,
    //         "cerebral": (rawTone.joy + rawTone.anger + rawTone.disgust + rawTone.analytical + rawPersonality.neuroticism + rawPersonality.conscientiousness)/6,
    //         "suspenseful": (rawTone.joy + rawTone.disgust + rawPersonality.neuroticism + rawPersonality.openness + rawTone.tentative)/5,
    //         "exciting": (rawTone.joy + rawTone.fear + rawPersonality.openness + rawTone.confident + rawTone.tentative)/5
    //     };

    //     var toneThreshold = .35; //values below this should be considered false, and at or above true
    //     var toneBooleans = {};

    //     for (prop in processedTone){
    //         if(processedTone[prop] < toneThreshold){
    //             toneBooleans[prop] = false;
    //         }else{
    //             toneBooleans[prop] = true;
    //         }
    //     }

    //     var show = new Show({
    //         name: rawShow.name,
    //         description: rawShow.description,
    //         personality: JSON.stringify(rawPersonality),
    //         tone: JSON.stringify(toneBooleans),
    //         picURL: rawShow.picURL,
    //         episodeDuration: rawShow.episodeDuration,
    //         numberOfSeasons: rawShow.numberOfSeasons,
    //         whereToWatch: rawShow.whereToWatch
    //     });

    //     show.save(function(err, savedShow){
    //         if(err){
    //             console.log('err: ', err);
    //         }
    //         console.log('savedShow: ', savedShow);
    //         res.send(savedShow);
    //     });
    // });
// }

exports.deleteUser = function(req, res) {
    User.remove({ 
        _id: req.params.user_id
    }, function (err) {
        res.redirect('/admin');
        if (err){console.log('err: ', err)};
    });
};

exports.deleteShow = function(req, res) {
    Show.remove({ 
        _id: req.params.show_id
    }, function (err) {
        res.redirect('/admin');
        if (err){console.log('err: ', err)};
    });
};

//add user
exports.createUser = function(req, res) {
    User.create({ 
        name: req.body.name,
        personality: req.body.personality
    }, function (err, user) {
        res.redirect('/admin');
        if (err){console.log('err: ', err)};
    });
};

//add user
exports.createShow = function(req, res) {
    Show.create({ 
        name: req.body.name,
        description: req.body.description,
        personality: req.body.personality,
        tone: req.body.tone,
        picURL: req.body.picURL,
        episodeDuration: req.body.episodeDuration,
        numberOfSeasons: req.body.numberOfSeasons,
        whereToWatch: req.body.whereToWatch
    }, function (err, user) {
        res.redirect('/admin');
        if (err){console.log('err: ', err)};
    });
};

//App Routes
//find show by name
exports.findShow = function(req, res) {
    Show.findOne({"name" : req.body.name}, function(err, show){
        if(err){console.log('err: ', err)}
        res.json(show);
    });
};

exports.rateShow = function(req, res) {
    Show.findOne({"_id" : req.params.show_id}, function(err, show){
        if(err){console.log('err: ', err)}
        if(show){
            show.rating = req.params.rating;
            show.save(function(err){
                if(err){console.log('err: ', err)}
                User.find(function(err, users){
                    if(err){console.log('err: ', err)}
                    if(users){
                        users[0]._watched_shows.push(show._id);
                        users[0].save;
                    }
                });
            });
        }
    });
};

//Add to lists
exports.addToWatch = function(req, res) {
    var showId = '';

    if(req.params.show_id && req.params.show_id != 'admin'){
        showId = req.params.show_id;
    }else if(req.body.show_id){
        showId = req.body.show_id;
    }else{
        console.log('No show ID provided.');
    }

    User.find(function(err, users){
        users[0]._shows_to_watch.push(showId);
        users[0]
        .save(function(err, user){
            res.redirect('/admin');
            if(err){console.log(err);}
        });
    });
};

exports.addHaveWatched = function(req, res) {
    var showId = '';

    if(req.params.show_id && req.params.show_id != 'admin'){
        showId = req.params.show_id;
    }else if(req.body.show_id){
        showId = req.body.show_id;
    }else{
        console.log('No show ID provided.');
    }

    User.find(function(err, users){
        users[0]._watched_shows.push(showId);
        users[0]
        .save(function(err, user){
            res.redirect('/admin');
            if(err){console.log(err);}
        });
    });
};

exports.addSuggested = function(req, res) {
    var showId = '';

    if(req.params.show_id && req.params.show_id != 'admin'){
        showId = req.params.show_id;
    }else if(req.body.show_id){
        showId = req.body.show_id;
    }else{
        console.log('No show ID provided.');
    }

    User.find(function(err, users){
        users[0]._suggested_shows.push(showId);
        users[0]
        .save(function(err, user){
            // console.log(user);
        })
        res.redirect('/admin');
    });
};

//Get user with lists packed in
exports.oneUser = function(req, res) {
    function matchScoreAlgorithm(userPersonality, showPersonality){

        //weignts, constants
        var neuroticismWeight = 0.2;
        var opennessWeight = 0.3;
        var extraversionWeight = 0.25;
        var conscientiousnessWeight = 0.125;
        var agreeablenessWeight = 0.125;

        //scores, variable
        var neuroticismScore = Math.abs(userPersonality.Neuroticism - showPersonality.neuroticism);
        var opennessScore = Math.abs(userPersonality.Openness - showPersonality.openness);
        var extraversionScore = Math.abs(userPersonality.extraversion - showPersonality.extraversion);
        var conscientiousnessScore = Math.abs(userPersonality.Conscientiousness - showPersonality.conscientiousness);
        var agreeablenessScore = Math.abs(userPersonality.Agreeableness - showPersonality.agreeableness);


        //weighted scores
        var weightedNeuroticismScore = neuroticismScore * neuroticismWeight;
        var weightedOpennessScore = opennessScore * opennessWeight;
        var weightedExtraversionScore = extraversionScore * extraversionWeight;
        var weightedConscientiousnessScore = conscientiousnessScore * conscientiousnessWeight;
        var weightedAgreeablenessScore = agreeablenessScore * agreeablenessWeight;

        //combine and invert for final score
        //integer between 0 and 100 represents users percent match to show, higher is better match
        var matchScore = 1 - (weightedNeuroticismScore + weightedOpennessScore + weightedConscientiousnessScore);
        matchScore = Math.round(matchScore*100);
        return matchScore;
    }

    User
    .find()
    .populate('_suggested_shows')
    .populate('_watched_shows')
    .populate('_shows_to_watch')
    .exec(function(err, users){
        users[0]._suggested_shows.forEach(function(show, index, array){
            var parsedUserPersonality = JSON.parse(users[0].personality);
            var parsedShowPersonality = JSON.parse(show.personality);

            users[0]._suggested_shows[index].matchScore = matchScoreAlgorithm(parsedUserPersonality, parsedShowPersonality);
        });

        users[0]._watched_shows.forEach(function(show, index, array){
            var parsedUserPersonality = JSON.parse(users[0].personality);
            var parsedShowPersonality = JSON.parse(show.personality);

            users[0]._watched_shows[index].matchScore = matchScoreAlgorithm(parsedUserPersonality, parsedShowPersonality);
        });

        users[0]._shows_to_watch.forEach(function(show, index, array){
            var parsedUserPersonality = JSON.parse(users[0].personality);
            var parsedShowPersonality = JSON.parse(show.personality);

            users[0]._shows_to_watch[index].matchScore = matchScoreAlgorithm(parsedUserPersonality, parsedShowPersonality);
        });

        //for now only the first user created is made available available
        var firstUser = users[0];
        res.json(firstUser);
    });
};

exports.loadSampleData = function(req, res){
    var lucasUser = new User({ "name" : "Lucas Farah", "personality" : "{\"Neuroticism\" : 0.23852331727306597, \"Openness\" : 0.19985873018309458, \"Extraversion\" : 0.5250972377475239, \"Conscientiousness\" : 0.6896876186993252, \"Agreeableness\" : 0.4824766686919894}"});

    lucasUser.save(function(err){
        if(err){console.log(err);}
    });

    var show1 = new Show({"name" : "Game of Thrones", "description" : "While a civil war brews between several noble families in Westeros, the children of the former rulers of the land attempt to rise up to power. Meanwhile a forgotten race, bent on destruction, return after thousands of years in the North.", "personality" : "{\"Neuroticism\" : 0.43852331727306597, \"Openness\" : 0.53985873018309458, \"Extraversion\" : 0.3250972377475239, \"Conscientiousness\" : 0.9896876186993252, \"Agreeableness\" : 0.6824766686919894}", "tone" : "{\"Anger\": 0.65324, \"Disgust\": 0.15324, \"Fear\": 0.25324, \"Joy\": 0.55324, \"Sadness\": 0.85324, \"Analytical\": 0.75324,  \"Confident\": 0.95324,  \"Tentative\": 0.75324,  \"Anger\": 0.15324}", "picURL" : "http://www.osunatierradedragones.es/images/drgon.jpg", "episodeDuration" : 60, "numberOfSeasons" : 5, "whereToWatch" : "http://www.hbogo.com/game-of-thrones-interactive-features/"});
    show1.save(function(err){
        if(err){console.log(err);}
    });

    var show2 = new Show({"name" : "The Expanse", "description" : "A police detective in the asteroid belt, the first officer of an interplanetary ice freighter and an earth-bound United Nations executive slowly discover a vast.", "personality" : "{\"Neuroticism\" : 0.63852331727306597, \"Openness\" : 0.33985873018309458, \"Extraversion\" : 0.1250972377475239, \"Conscientiousness\" : 0.2896876186993252, \"Agreeableness\" : 0.8824766686919894}", "tone" : {"Anger": 0.15324, "Disgust": 0.55324, "Fear": 0.35324, "Joy": 0.25324, "Sadness": 0.65324, "Analytical": 0.95324,  "Confident": 0.35324,  "Tentative": 0.55324,  "Anger": 0.85324}, "picURL" : "http://cdn.hitfix.com/photos/6170220/The-Expanse-header.jpg", "episodeDuration" : 60, "numberOfSeasons" : 1, "whereToWatch" : "http://www.syfy.com/theexpanse/episodes"});
    show2.save(function(err){
        if(err){console.log(err);}
    });

    var show3 = new Show({ "name" : "Sense8", "description" : "A group of people around the world are suddenly linked mentally, and must find a way to survive being.", "personality" : "{\"Neuroticism\" : 0.43852331727306597, \"Openness\" : 0.13985873018309458, \"Extraversion\" : 0.5250972377475239, \"Conscientiousness\" : 0.4896876186993252, \"Agreeableness\" : 0.7824766686919894}", "tone" : "{\"Anger\": 0.95324, \"Disgust\": 0.75324, \"Fear\": 0.25324, \"Joy\": 0.15324, \"Sadness\": 0.75324, \"Analytical\": 0.55324,  \"Confident\": 0.15324,  \"Tentative\": 0.65324,  \"Anger\": 0.55324}", "picURL" : "https://pbs.twimg.com/profile_images/606887678978572288/6SQ0c119.jpg", "episodeDuration" : 60, "numberOfSeasons" : 1, "whereToWatch" : "http://www.netflix.com/watch/80025744"});
    show3.save(function(err){
        if(err){console.log(err);}
    });

    res.send('data was probably loaded');
}

//Remove this later
exports.tonetest = function(req, res) {
	var text = 'ARMONK, N.Y. - 11 Jan 2012: IBM (NYSE: IBM) today announced that it set a new U.S. patent record in 2011, marking the 19th consecutive year that the company has led the annual list of patent recipients. IBM inventors earned a record 6,180 U.S. patents in 2011, more than quadrupling Hewlett-Packard’s issuances and exceeding by six times those of Oracle/Sun.  More than 8,000 IBMers living in 46 different U.S. states and 36 countries are responsible for the companys record-breaking 2011 patent tally. IBM inventors who do not reside in the U.S. contributed to more than 26% of the companys 2011 patents.  The more than 6,000 patents IBMers received in 2011 represent a range of inventions that enable new innovations and add significant value to the companys products, services, including smarter solutions for retail, banking, healthcare, transportation and other industries. These patented inventions also span a wide range of computing technologies poised to support a new generation of more cognitive, intelligent and insight-driven systems, processes and infrastructures for smarter commerce, shopping, medicine, transportation, and more.  "IBMs commitment to invention and scientific exploration is unmatched in any industry and the results of this dedication to enabling innovation is evidenced in our nearly two decades of U.S. patent leadership,” said Ken King, general manager, Intellectual Property and vice president, Research Business Development, IBM. “The inventions we patent each year deliver significant value to IBM, our clients and partners and demonstrate a measurable return on our approximately $6 billion annual investment in research and development.”';
	watson.watsonApi(text,function(callback){
		res.json(callback);
	});

};
exports.twitter = function(req, res) {
    var movie_name =req.query.q;
    var rate = 91;
tw.tweet(movie_name,rate);
res.json("Done");
};


// var fakeResult = {
//     'name' : 'Fake User',
//     '_shows_to_watch' : [
//         {
//             'name': 'Game of Thrones',
//             'description': 'Epic fantasy, world war showdown! Can humanity find peace and unite to save itself?',
//             'matchScore': 99.9,
//             'picURL': 'http://www.osunatierradedragones.es/images/drgon.jpg',
//             'episodeDuration': 60,
//             'numberOfSeasons': 5,
//             'whereToWatch': 'hbogo.com'
//         }, 
//         {
//             'name': 'The Expanse',
//             'description': 'Epic sci fi, solar system showdown! Can humanity find peace and unite to save itself?',
//             'matchScore': 95.5,
//             'picURL': 'http://cdn.hitfix.com/photos/6170220/The-Expanse-header.jpg',
//             'episodeDuration': 60,
//             'numberOfSeasons': 1,
//             'whereToWatch': 'syfy.com'
//         }, 
//         {
//             'name': 'Sense8',
//             'description': 'Eight incredible humans find themselves mind melding and fighting the battles of their lifetime.',
//             'matchScore': 87.2,
//             'picURL': 'https://pbs.twimg.com/profile_images/606887678978572288/6SQ0c119.jpg',
//             'episodeDuration': 60,
//             'numberOfSeasons': 1,
//             'whereToWatch': 'netflix.com'
//         }
//     ],
//     '_watched_shows' : [
//         {
//             'name': 'Game of Thrones',
//             'description': 'Epic fantasy, world war showdown! Can humanity find peace and unite to save itself?',
//             'matchScore': 99.9,
//             'picURL': 'http://www.osunatierradedragones.es/images/drgon.jpg',
//             'episodeDuration': 60,
//             'numberOfSeasons': 5,
//             'whereToWatch': 'hbogo.com'
//         }, 
//         {
//             'name': 'The Expanse',
//             'description': 'Epic sci fi, solar system showdown! Can humanity find peace and unite to save itself?',
//             'matchScore': 95.5,
//             'picURL': 'http://cdn.hitfix.com/photos/6170220/The-Expanse-header.jpg',
//             'episodeDuration': 60,
//             'numberOfSeasons': 1,
//             'whereToWatch': 'syfy.com'
//         }, 
//         {
//             'name': 'Sense8',
//             'description': 'Eight incredible humans find themselves mind melding and fighting the battles of their lifetime.',
//             'matchScore': 87.2,
//             'picURL': 'https://pbs.twimg.com/profile_images/606887678978572288/6SQ0c119.jpg',
//             'episodeDuration': 60,
//             'numberOfSeasons': 1,
//             'whereToWatch': 'netflix.com'
//         }
//     ],
//     '_suggested_shows' : [
//         {
//             'name': 'Game of Thrones',
//             'description': 'Epic fantasy, world war showdown! Can humanity find peace and unite to save itself?',
//             'matchScore': 99.9,
//             'picURL': 'http://www.osunatierradedragones.es/images/drgon.jpg',
//             'episodeDuration': 60,
//             'numberOfSeasons': 5,
//             'whereToWatch': 'hbogo.com'
//         }, 
//         {
//             'name': 'The Expanse',
//             'description': 'Epic sci fi, solar system showdown! Can humanity find peace and unite to save itself?',
//             'matchScore': 95.5,
//             'picURL': 'http://cdn.hitfix.com/photos/6170220/The-Expanse-header.jpg',
//             'episodeDuration': 60,
//             'numberOfSeasons': 1,
//             'whereToWatch': 'syfy.com'
//         }, 
//         {
//             'name': 'Sense8',
//             'description': 'Eight incredible humans find themselves mind melding and fighting the battles of their lifetime.',
//             'matchScore': 87.2,
//             'picURL': 'https://pbs.twimg.com/profile_images/606887678978572288/6SQ0c119.jpg',
//             'episodeDuration': 60,
//             'numberOfSeasons': 1,
//             'whereToWatch': 'netflix.com'
//         }
//     ],
// };