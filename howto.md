Building a proximity search
====

Install
---
  * MongoDB
    * brew install mongodb
  * Node
  * NPM

start `mongod`


  * `npm install twitter` (node twitter streaming API library)
  * `npm install mongodb` (native mongodb driver for node)
  * `npm install express` (for convenience with API later)

Create a Twitter App
---

Get single-user access token & key

Ingest
---
Using the basic native driver, everything must be done in the database open callback

// Open the proximity database
db.open(function() {
	// Open the post collection
	db.collection('posts', function(err, collection) {
		// Start listening to the global stream
		twit.stream('statuses/sample', function(stream) {
			// For each post
			stream.on('data', function(data) {
				if ( !! data.geo) {
					collection.insert(data);
				}
			});
		});
	});
});

Index
---
`http://www.mongodb.org/display/DOCS/Geospatial+Indexing/`

Ensure a Geospatial index on the tweet
	db.posts.ensureIndex({"geo.coordinates" : "2d"})

Standard Geospatial search query:
	db.posts.find({"geo.coordinates": {$near: [50, 13]}}).pretty()
	(finds the closest points to (50,13) and returns them sorted by distance)

---
By this point, we've got a database full of geo-searchable posts and a way to do a proximity search on them. To be fair, it's more down to mongodb than anything we've done.

Next, we extend the search on those posts to allow filtering by query

---

`db.posts.find({"geo.coordinates": {$near: [50, 13]}, text: /.*searchterm.*/}).pretty()`

API
---
Super simple API, we only have two main query types
/proximity?latitude=55&longitude=13
/proximity?latitude=55&longitude=13&q=searchterm

Each of these can take an optional 'callback' parameter to enable jsonp. We're using express so the callback parameter and content type for returning JSON are both handled automatically.


