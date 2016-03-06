//models
var User = require('./app/models/user');
var Show = require('./app/models/show');

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