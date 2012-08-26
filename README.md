Proximity
========

A basic proximity search API built using MongoDB, node.js and express. This currently uses the Twitter Streaming API as the data source. 

Built mostly as a chance to experiment with MongoDB. Twitter provides its own proximity search so this was mostly an exercise.

There are two main scripts:

 * `ingest.js`
   * Connects to the Twitter Streaming API and saves geo-tagged tweets into MongoDB
 * `api.js`
   * The public API server
   
API
===

`/proximity?latitude=XX&longitude=XX`

This provides the 100 posts nearest to the given coordinate ordered by increasing distance.

`/proximity?latitude=XX&longitude=XX&q=SEARCHTERM`

This filters on the given search term first then orders the posts by proximity to the given coordinate.

Both of these can take a `&callback=XXX` parameter to enable `jsonp`