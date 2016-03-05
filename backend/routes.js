exports.index = function (req, res) {
    res.render('../app/views/index');
};

exports.oneUser = function(req, res) {
	var fakeResult = {
		'name' : 'Fake User',
		'_shows_to_watch' : [
			{
				'name': 'Game of Thrones',
				'description': 'Epic fantasy, world war showdown! Can humanity find peace and unite to save itself?',
				'matchScore': 99.9,
				'picURL': 'http://www.osunatierradedragones.es/images/drgon.jpg',
				'episodeDuration': 60,
				'numberOfSeasons': 5,
				'whereToWatch': 'hbogo.com'
			}, 
			{
				'name': 'The Expanse',
				'description': 'Epic sci fi, solar system showdown! Can humanity find peace and unite to save itself?',
				'matchScore': 95.5,
				'picURL': 'http://cdn.hitfix.com/photos/6170220/The-Expanse-header.jpg',
				'episodeDuration': 60,
				'numberOfSeasons': 1,
				'whereToWatch': 'syfy.com'
			}, 
			{
				'name': 'Sense8',
				'description': 'Eight incredible humans find themselves mind melding and fighting the battles of their lifetime.',
				'matchScore': 87.2,
				'picURL': 'https://pbs.twimg.com/profile_images/606887678978572288/6SQ0c119.jpg',
				'episodeDuration': 60,
				'numberOfSeasons': 1,
				'whereToWatch': 'netflix.com'
			}
		],
		'_watched_shows' : [
			{
				'name': 'Game of Thrones',
				'description': 'Epic fantasy, world war showdown! Can humanity find peace and unite to save itself?',
				'matchScore': 99.9,
				'picURL': 'http://www.osunatierradedragones.es/images/drgon.jpg',
				'episodeDuration': 60,
				'numberOfSeasons': 5,
				'whereToWatch': 'hbogo.com'
			}, 
			{
				'name': 'The Expanse',
				'description': 'Epic sci fi, solar system showdown! Can humanity find peace and unite to save itself?',
				'matchScore': 95.5,
				'picURL': 'http://cdn.hitfix.com/photos/6170220/The-Expanse-header.jpg',
				'episodeDuration': 60,
				'numberOfSeasons': 1,
				'whereToWatch': 'syfy.com'
			}, 
			{
				'name': 'Sense8',
				'description': 'Eight incredible humans find themselves mind melding and fighting the battles of their lifetime.',
				'matchScore': 87.2,
				'picURL': 'https://pbs.twimg.com/profile_images/606887678978572288/6SQ0c119.jpg',
				'episodeDuration': 60,
				'numberOfSeasons': 1,
				'whereToWatch': 'netflix.com'
			}
		],
		'_suggested_shows' : [
			{
				'name': 'Game of Thrones',
				'description': 'Epic fantasy, world war showdown! Can humanity find peace and unite to save itself?',
				'matchScore': 99.9,
				'picURL': 'http://www.osunatierradedragones.es/images/drgon.jpg',
				'episodeDuration': 60,
				'numberOfSeasons': 5,
				'whereToWatch': 'hbogo.com'
			}, 
			{
				'name': 'The Expanse',
				'description': 'Epic sci fi, solar system showdown! Can humanity find peace and unite to save itself?',
				'matchScore': 95.5,
				'picURL': 'http://cdn.hitfix.com/photos/6170220/The-Expanse-header.jpg',
				'episodeDuration': 60,
				'numberOfSeasons': 1,
				'whereToWatch': 'syfy.com'
			}, 
			{
				'name': 'Sense8',
				'description': 'Eight incredible humans find themselves mind melding and fighting the battles of their lifetime.',
				'matchScore': 87.2,
				'picURL': 'https://pbs.twimg.com/profile_images/606887678978572288/6SQ0c119.jpg',
				'episodeDuration': 60,
				'numberOfSeasons': 1,
				'whereToWatch': 'netflix.com'
			}
		],
	};
	
	res.json(fakeResult);
}