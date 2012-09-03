var util = require('util'),
	twitter = require('twitter'),
    config = require('./config'),
	count = 0,
	incount = 0;

var mongodb = require("mongodb"),
	mongoserver = new mongodb.Server("localhost", 27017),
	db = new mongodb.Db("proximity", mongoserver);


var twit = new twitter(config.twitter);

// Open the proximity database
db.open(function() {
	// Open the post collection
	db.collection('posts', function(err, collection) {

		// Start listening to the global stream
		twit.stream('statuses/sample', function(stream) {

			// For each post
			stream.on('data', function(data) {
				count++;
				if ( !! data.geo && !! data.geo.coordinates && data.geo.coordinates[0] !== 0 && data.geo.coordinates[1] !== 0 ) {
					collection.insert(data, {
						safe: true
					}, function(err, records) {
						incount++;
					});
				}
				if (count % 100 === 0) {
					console.log(count + ' (' + incount + ')');
				}
			});
		});
	});
});