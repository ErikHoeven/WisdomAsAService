'use strict'
// Global variabele
var d3 = require("d3");
var mongo = require('mongodb');
var db = require('monk')('localhost/commevents');
var tweets = db.get('STG_LEADS_AUTOSCHADE');
var businessrules = db.get('businessrules');
var format = d3.time.format("%Y-%m-%d");

exports.find = function(req, res, next) {
    // find Tweets in Database
    console.info('find tweets: ...');
    tweets.find({}, {}, function (err, tweets) {
        var stgTweets = setStgTweets(tweets);
        var tweetsPerDay = setTweetsPerDay(stgTweets);
        var domainValues = setDomainValues(tweetsPerDay);
        setTweetCattegory(stgTweets, tweetsPerDay, domainValues, stgTweets);
    });

    //
    function setStgTweets(tweets) {
        console.log('setStgTweets');
        var aantalTweets = tweets.length;
        var stgTweets = [];

        for (var i = 0; i < aantalTweets; i++) {
            stgTweets[i] = {
                userId: tweets[i].user.id,
                userFollowerCount: tweets[i].user.followers_count,
                userFriendCount: tweets[i].user.friends_count,
                userFavouritesCount: tweets[i].user.favourites_count,
                text: tweets[i].text,
                coordinates: tweets[i].coordinates,
                userLocation: tweets[i].user.location,
                postDate: format(new Date(tweets[i].created_at))
            }
        }
        return stgTweets;
    }
    function setTweetsPerDay(stgTweets) {
        //Count tweets per postDate
        var tweetsPerDay = d3.nest()
            .key(function (d) {
                return d.postDate;
            })
            .rollup(function (v) {
                return v.length;
            })
            .entries(stgTweets);

        var lstDate = [];
        var jsonLength = tweetsPerDay.length;

        for (var i = 0; i < jsonLength; i++) {
            lstDate[i] = {
                dim: tweetsPerDay[i].key,
                measure: tweetsPerDay[i].values
            };
        }
        return lstDate
    }

    function setDomainValues(data) {

        var lstDimensionValues = [];
        var lstMeasures = []
        for (var i = 0; i < data.length; i++) {
            lstDimensionValues.push(data[i].dim);
            lstMeasures.push(data[i].measure);
        }
        return {
            minDimensionValue: d3.min(lstDimensionValues),
            maxDimesnionValue: d3.max(lstDimensionValues),
            minMeasure: d3.min(lstMeasures),
            maxMeasure: d3.max(lstMeasures)
        };
    }

    function setTweetCattegory(tweets, tweetsPerDay, domainValues, stgTweets) {
        businessrules.find({"typeBusinessRule": "Cattegorie"}, {}, function (err, cattegories) {
            var cattegorie = {cat: 'All tweets', color: '47A947' } ;
            var stgTweetCattegory = [];
            var stgTweetsPerCattegory = [];
            var dmTweetsPerCattegory = [];

            for (var i = 0; i < stgTweets.length; i++) {

                var cattegorieMatch = findandsetCattegorie(stgTweets[i], cattegories);

                if(cattegorieMatch){
                    cattegorie = cattegorieMatch;
                }
                stgTweetCattegory.push({
                    userId: stgTweets[i].userId,
                    userFollowerCount: stgTweets[i].userFollowerCount,
                    userFriendCount: stgTweets[i].userFriendCount,
                    userFavouritesCount: stgTweets[i].userFavouritesCount,
                    text: stgTweets[i].text,
                    coordinates: stgTweets[i].coordinates,
                    userLocation: stgTweets[i].userLocation,
                    postDate: stgTweets[i].postDate,
                    tweetCattegorie: cattegorie.cat,
                    color:cattegorie.color

                })
            }
               stgTweetsPerCattegory = d3.nest()
                   .key(function(d) { return d.name; })
                   .rollup(function(v) { return {
                       count: v.length,
                       total: d3.sum(v, function(d) { return d.amount; }),
                       avg: d3.mean(v, function(d) { return d.amount; })
                   }; })
                   .entries(stgTweetCattegory);


               for (var k = 0; k < Object.keys(stgTweetsPerCattegory).length; k++) {
                  var catt = Object.keys(stgTweetsPerCattegory)[k];
                  console.info(catt)
                   console.info(stgTweetsPerCattegory.Object.keys(stgTweetsPerCattegory)[k]);

               }



        /*    { 'All tweets': { '47A947': 17 },
                concurentie: { ff0000: 294 },
                Concurentie: { '0fa7c2': 405 } }*/


            //console.log(stgTweetsPerCattegory);
            //console.log(stgTweetsPerCattegory);

            function findandsetCattegorie(objtweet, objcattegories) {
                //console.info('---------------findandsetCattegorie on ' +  objtweet.text   + ' -------------------------');
                if (objcattegories) {
                    var CountCattegories = objcattegories.length;
                    // Loop through the cattegories
                    for (var ct = 0; ct < CountCattegories; ct++) {
                        var catValues = objcattegories[ct].cattegoryValue.length;
                        if (catValues) {
                            // Loop through catvalues
                            for (var cv = 0; cv < catValues; cv++) {
                                // Check if tweet.text matched with the cattegorie value
                                var CheckValue = objtweet.text.search(objcattegories[ct].cattegoryValue[cv]);
                                //console.info(typeof(CheckValue));
                                if (CheckValue > 0) {
                                    // Assign categorie to var cattegorie
                                    //console.info('Match')
                                    //console.log(objtweet.text.search(objcattegories[ct].cattegoryValue[cv]));
                                    return  {cat: objcattegories[ct].tagCattegory, color: objcattegories[ct].cattegorycolor }
                                }
                            }
                        }
                        else {
                            //console.info('Geen cattegorie waarde beschikbaar');
                        }
                    }
                }
                else {
                    //console.info('Geen cattegorieen beschikbaar');
                }
            }

        });
    }
}






