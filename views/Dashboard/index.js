'use strict'
// Global variabele
var d3 = require("d3");
var mongo = require('mongodb');
var db = require('monk')('localhost/commevents');
var tweets = db.get('STG_LEADS_AUTOSCHADE');
var businessrules = db.get('businessrules');
var format = d3.time.format("%Y-%m-%d");



exports.find = function(req, res, next){
    // find Tweets in Database
    console.info('find tweets: ...');
    tweets.find({},{},function (err,tweets){
        var stgTweets = setStgTweets(tweets);
        var tweetsPerDay = setTweetsPerDay(stgTweets);
        var domainValues = setDomainValues(tweetsPerDay);
        setTweetCattegory(stgTweets,tweetsPerDay,domainValues, stgTweets );
    });

    //
    function setStgTweets(tweets) {
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

    function setDomainValues(data){

        var lstDimensionValues = [];
        var lstMeasures = []
        for (var i = 0; i < data.length; i++ ){
            lstDimensionValues.push(data[i].dim);
            lstMeasures.push(data[i].measure);
        }
        return { minDimensionValue: d3.min(lstDimensionValues),
            maxDimesnionValue: d3.max(lstDimensionValues),
            minMeasure: d3.min(lstMeasures),
            maxMeasure: d3.max(lstMeasures)};
    }


   function setTweetCattegory(tweets,tweetsPerDay, domainValues, stgTweets ) {
       businessrules.distinct('tagCattegory', function (err, cattegory) {
           var tweetsPerCattegorry = [];
           for (var i = 0; i < tweets.length; i++) {
               var IsCatTweet = 0

               for (var t = 0; t < cattegory.length; t++) {
                   if ((tweets[i].text.search(cattegory[t]) > 0) && cattegory[t] != '' && cattegory[t] != null) {

                       tweetsPerCattegorry.push( {
                           userId: tweets[i].userId,
                           userFollowerCount: tweets[i].userFollowerCount,
                           userFriendCount: tweets[i].userFriendCount,
                           userFavouritesCount: tweets[i].userFavouritesCount,
                           text: tweets[i].text,
                           coordinates: tweets[i].coordinates,
                           userLocation: tweets[i].userLocation,
                           postDate: tweets[i].postDate,
                           cattegories: cattegory[t]
                       });
                   }
               }
           }
           var data = d3.nest()
               .key(function (d) {
                   return d.cattegories;
               })
               .rollup(function (v) {
                   return v.length;
               })
               .entries(tweetsPerCattegorry);


           var lstCatteorie = [];
           for (var i = 0; i < data.length; i++) {
               lstCatteorie[i] = {
                   dim: data[i].key,
                   measure: data[i].values
               };
           }



           res.render('Dashboard/index', {
               'tweets': stgTweets,
               'tweetsPerDay': tweetsPerDay,
               'domainValues': domainValues,
               'tweetsPerCattegorry': lstCatteorie
           });
       });

   }



};






