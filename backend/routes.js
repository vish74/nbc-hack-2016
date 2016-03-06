//models
var User = require('./app/models/user');
var Show = require('./app/models/show');
var watson = require('./app/helpers/watsonApi');

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
        })
    });
};

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
        var extroversionWeight = 0.25;
        var conscientiousnessWeight = 0.125;
        var agreeablenessWeight = 0.125;

        //scores, variable
        var neuroticismScore = Math.abs(userPersonality.Neuroticism - showPersonality.Neuroticism);
        var opennessScore = Math.abs(userPersonality.Openness - showPersonality.Openness);
        var extroversionScore = Math.abs(userPersonality.extroversion - showPersonality.extroversion);
        var conscientiousnessScore = Math.abs(userPersonality.Conscientiousness - showPersonality.Conscientiousness);
        var agreeablenessScore = Math.abs(userPersonality.Agreeableness - showPersonality.Agreeableness);

        //weighted scores
        var weightedNeuroticismScore = neuroticismScore * neuroticismWeight;
        var weightedOpennessScore = opennessScore * opennessWeight;
        var weightedExtroversionScore = extroversionScore * extroversionWeight;
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

            //apply match score algorithm to all 3 show arrays
            users[0]._suggested_shows[index].matchScore = matchScoreAlgorithm(parsedUserPersonality, parsedShowPersonality);
            users[0]._watched_shows[index].matchScore = matchScoreAlgorithm(parsedUserPersonality, parsedShowPersonality);
            users[0]._shows_to_watch[index].matchScore = matchScoreAlgorithm(parsedUserPersonality, parsedShowPersonality);
        });

        //for now only the first user created is made available available
        var firstUser = users[0];
        res.json(firstUser);
    });
};

exports.loadSampleData = function(req, res){
    var lucasUser = new User({ "name" : "Lucas Farah", "personality" : "{\"Neuroticism\" : 0.23852331727306597, \"Openness\" : 0.19985873018309458, \"Extroversion\" : 0.5250972377475239, \"Conscientiousness\" : 0.6896876186993252, \"Agreeableness\" : 0.4824766686919894}"});

    lucasUser.save(function(err){
        if(err){console.log(err);}
    });

    var show1 = new Show({"name" : "Game of Thrones", "description" : "While a civil war brews between several noble families in Westeros, the children of the former rulers of the land attempt to rise up to power. Meanwhile a forgotten race, bent on destruction, return after thousands of years in the North.", "personality" : "{\"Neuroticism\" : 0.43852331727306597, \"Openness\" : 0.53985873018309458, \"Extroversion\" : 0.3250972377475239, \"Conscientiousness\" : 0.9896876186993252, \"Agreeableness\" : 0.6824766686919894}", "tone" : "{\"Anger\": 0.65324, \"Disgust\": 0.15324, \"Fear\": 0.25324, \"Joy\": 0.55324, \"Sadness\": 0.85324, \"Analytical\": 0.75324,  \"Confident\": 0.95324,  \"Tentative\": 0.75324,  \"Anger\": 0.15324}", "picURL" : "http://www.osunatierradedragones.es/images/drgon.jpg", "episodeDuration" : 60, "numberOfSeasons" : 5, "whereToWatch" : "http://www.hbogo.com/game-of-thrones-interactive-features/"});
    show1.save(function(err){
        if(err){console.log(err);}
    });

    var show2 = new Show({"name" : "The Expanse", "description" : "A police detective in the asteroid belt, the first officer of an interplanetary ice freighter and an earth-bound United Nations executive slowly discover a vast.", "personality" : "{\"Neuroticism\" : 0.63852331727306597, \"Openness\" : 0.33985873018309458, \"Extroversion\" : 0.1250972377475239, \"Conscientiousness\" : 0.2896876186993252, \"Agreeableness\" : 0.8824766686919894}", "tone" : {"Anger": 0.15324, "Disgust": 0.55324, "Fear": 0.35324, "Joy": 0.25324, "Sadness": 0.65324, "Analytical": 0.95324,  "Confident": 0.35324,  "Tentative": 0.55324,  "Anger": 0.85324}, "picURL" : "http://cdn.hitfix.com/photos/6170220/The-Expanse-header.jpg", "episodeDuration" : 60, "numberOfSeasons" : 1, "whereToWatch" : "http://www.syfy.com/theexpanse/episodes"});
    show2.save(function(err){
        if(err){console.log(err);}
    });

    var show3 = new Show({ "name" : "Sense8", "description" : "A group of people around the world are suddenly linked mentally, and must find a way to survive being.", "personality" : "{\"Neuroticism\" : 0.43852331727306597, \"Openness\" : 0.13985873018309458, \"Extroversion\" : 0.5250972377475239, \"Conscientiousness\" : 0.4896876186993252, \"Agreeableness\" : 0.7824766686919894}", "tone" : "{\"Anger\": 0.95324, \"Disgust\": 0.75324, \"Fear\": 0.25324, \"Joy\": 0.15324, \"Sadness\": 0.75324, \"Analytical\": 0.55324,  \"Confident\": 0.15324,  \"Tentative\": 0.65324,  \"Anger\": 0.55324}", "picURL" : "https://pbs.twimg.com/profile_images/606887678978572288/6SQ0c119.jpg", "episodeDuration" : 60, "numberOfSeasons" : 1, "whereToWatch" : "http://www.netflix.com/watch/80025744"});
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