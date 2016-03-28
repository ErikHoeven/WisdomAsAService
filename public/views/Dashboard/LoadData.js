// Created by: Erik

// get Tweets and convert them to an array with JSON objecten

var aantalSrcTweets = srcTweets.length;

// (1)Loop throug all tweets and collect all relevant elementen from srcTweet:
var stgTweet = {};
var stgTweets = [];
// (a) Format dateType to readable format
var format = d3.time.format("%Y-%m-%d");

for(var i = 0; i < aantalSrcTweets; i++){
    stgTweets[i] = {
        userId: srcTweets[i].user.id,
        userFollowerCount: srcTweets[i].user.followers_count,
        userFriendCount: srcTweets[i].user.friends_count,
        userFavouritesCount: srcTweets[i].user.favourites_count,
        text: srcTweets[i].text,
        coordinates: srcTweets[i].coordinates,
        userLocation: srcTweets[i].user.location,
        postDate: format(new Date(srcTweets[i].created_at)),
        rawPostDate :srcTweets[i].created_at
    }
}

// Loading into DataMart TweetsperDay
var tweetsPerDay = d3.nest()
    .key(function (d){return d.postDate; })
    .rollup(function(v){return v.length;})
    .entries(stgTweets);


var m = d3.map(stgTweets, function(d){
    return d.userFollowerCount;
});

console.info(stgTweets);
console.info(tweetsPerDay);





