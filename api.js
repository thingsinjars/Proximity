/*
 * The output side of the proximity search
 *
 * Accepts valid latitude/longitude and an optional query string
 */

var express = require("express"),
	app = express();

var mongodb = require("mongodb"),
	mongoserver = new mongodb.Server("localhost", 27017),
	db = new mongodb.Db("proximity", mongoserver);

/* Everything happens in the database open callback */
db.open(function() {
	db.collection('posts', function(err, collection) {
		app.get('/proximity', function(req, res) {
			var latitude, longitude, q;
			latitude = parseFloat(req.query["latitude"]);
			longitude = parseFloat(req.query["longitude"]);
			q = req.query["q"];

			if (/^(\-?\d+(\.\d+)?)$/.test(latitude) && /^(\-?\d+(\.\d+)?)$/.test(longitude)) {
				if (typeof q === 'undefined') {
					collection.find({
						"geo.coordinates": {
							$near: [latitude, longitude]
						}
					}, function(err, cursor) {
						cursor.toArray(function(err, items) {
							writeResponse(items, res);
						});
					});
				} else {
					var regexQuery = new RegExp(".*" + q + ".*");
					collection.find({
						"geo.coordinates": {
							$near: [latitude, longitude]
						},
						'text': regexQuery
					}, function(err, cursor) {
						cursor.toArray(function(err, items) {
							writeResponse(items, res);
						});
					});
				}
			} else {
				res.send('malformed lat/lng');
			}

		});
	});
});


/* 
 * There's room here to preprocess any response
 * At the moment, simply removes the mongoDB _id
 */

function writeResponse(documents, res) {
	for (var i = 0, l = documents.length; i < l; i++) {
		delete documents[i]._id;
	}
	res.contentType('application/json');
	res.json(documents);

}


app.listen(3000);