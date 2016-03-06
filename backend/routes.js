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
            console.log(user);
        })
        res.redirect('/admin');
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
            console.log(user);
        })
        res.redirect('/admin');
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
            console.log(user);
        })
        res.redirect('/admin');
    });
};

//Get user with lists packed in
exports.oneUser = function(req, res) {
    // function matchAlgorithm(shows, userPersonality){
    //     users[0]._suggested_shows.forEach(function(show){
    //         show.matchScore = count;
    //         count += 10;
    //     });
    // }

    User
    .find()
    .populate('_suggested_shows', '_watched_shows')
    .populate('_shows_to_watch')
    .exec(function(err, users){
        var count = 10;
        users[0]._suggested_shows.forEach(function(show){
            show.matchScore = count;
            count += 10;
        });
        users[0]._watched_shows.forEach(function(show){
            show.matchScore = count;
            count += 10;
        });
        users[0]._shows_to_watch.forEach(function(show){
            show.matchScore = count;
            count += 10;
        });
        res.json(users[0]);
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

//Remove this later
exports.tonetest = function(req, res) {
	var text = 'ARMONK, N.Y. - 11 Jan 2012: IBM (NYSE: IBM) today announced that it set a new U.S. patent record in 2011, marking the 19th consecutive year that the company has led the annual list of patent recipients. IBM inventors earned a record 6,180 U.S. patents in 2011, more than quadrupling Hewlett-Packard’s issuances and exceeding by six times those of Oracle/Sun.  More than 8,000 IBMers living in 46 different U.S. states and 36 countries are responsible for the companys record-breaking 2011 patent tally. IBM inventors who do not reside in the U.S. contributed to more than 26% of the companys 2011 patents.  The more than 6,000 patents IBMers received in 2011 represent a range of inventions that enable new innovations and add significant value to the companys products, services, including smarter solutions for retail, banking, healthcare, transportation and other industries. These patented inventions also span a wide range of computing technologies poised to support a new generation of more cognitive, intelligent and insight-driven systems, processes and infrastructures for smarter commerce, shopping, medicine, transportation, and more.  "IBMs commitment to invention and scientific exploration is unmatched in any industry and the results of this dedication to enabling innovation is evidenced in our nearly two decades of U.S. patent leadership,” said Ken King, general manager, Intellectual Property and vice president, Research Business Development, IBM. “The inventions we patent each year deliver significant value to IBM, our clients and partners and demonstrate a measurable return on our approximately $6 billion annual investment in research and development.”';
	watson.watsonApi(text,function(callback){
		res.json(callback);
	});

};