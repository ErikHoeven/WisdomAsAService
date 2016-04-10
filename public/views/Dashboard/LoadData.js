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
        postDate: format(new Date(srcTweets[i].created_at))
    }
}

// Loading into DataMart TweetsperDay
var tweetsPerDay = d3.nest()
    .key(function (d){return d.postDate; })
    .rollup(function(v){return v.length;})
    .entries(stgTweets);


function getLstValuePerDate(data) {
    var lstDate = [];
    var jsonLength = data.length;

    for (var i = 0; i < jsonLength; i++) {
        lstDate[i] = {
            dim: format.parse(data[i].key),
            measure: data[i].values
        };
    }
    return lstDate
}

function getDomainValues(data){

    lstDimensionValues = [];
    lstMeasures = []
    for (var i = 0; i < data.length; i++ ){
        lstDimensionValues.push(data[i].dim);
        lstMeasures.push(data[i].measure);
    }
    return { minDimensionValue: d3.min(lstDimensionValues),
             maxDimesnionValue: d3.max(lstDimensionValues),
             minMeasure: d3.min(lstMeasures),
             maxMeasure: d3.max(lstMeasures)};


}














