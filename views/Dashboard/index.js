'use strict';
// Global variabele
var d3 = require("d3");
var mongo = require('mongodb');
var db = require('monk')('localhost/commevents');
var tweets = db.get('STG_LEADS_AUTOSCHADE');
var businessrules = db.get('businessrules');
var format = d3.time.format("%Y-%m-%d");
var fs = require('fs');

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
        var lstMeasures = [];
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
            var cattegorie = {cat: 'Overige tweets', color: '47A947' } ;
            var stgTweetCattegory = [];
            var stgTweetsPerCattegory = [];
            var dmTweetsPerCattegory = [];
            var dmCountUserPerDay = [];



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
                    color:cattegorie.color,


                })
            }

            // Aggegrate an input JSON Array to a summerized JSON Array (maximum is 5 fields)
            //input 1: array with json key's to be aggegrated
            //input 2: aggegrate expression (sum, count, avg)
            //input 3: aggegrate preparation for pieChart ['Y'/ 'N']
            //input 4: JSON input to aggagrate

            function agg_json_object(aggFields, jsoninput, pieChart) {
                var aggOutput =  [];

                if (aggFields.length == 1) {
                    var aggJSONData = d3.nest()
                        .key(function (d) {
                            return d[aggFields[0]]
                        })
                        .rollup(function (v) {
                            return v.length;
                        })
                        .entries(jsoninput);
                }

                if (aggFields.length == 2) {
                   console.info('Twee');
                    var aggJSONData = d3.nest()
                        .key(function (d) {
                            return d[aggFields[0]] + '-' + d[aggFields[1]];
                        })
                        .rollup(function (v) {
                            return v.length;
                        })
                        .entries(jsoninput);
                    console.info(' aggJSONData');
                    console.info(aggJSONData);
                    aggJSONData.forEach(function(a){
                        if(a.key.search(/-/i) > 0){
                            var keys = [];
                            keys.push(a.key.substring(0,a.key.search(/-/i)));
                            keys.push(a.key.substring(a.key.search(/-/i)+1, a.key.length));

                            var jsonString = {};

                            if (pieChart == 'N'){
                                jsonString[aggFields[0]] = keys[0];
                                jsonString[aggFields[1]] = keys[1];
                                jsonString['values'] = a.values;


                            }
                            else {
                                jsonString['label'] = keys[0];
                                jsonString['color'] = keys[1];
                                jsonString['value'] = a.values;
                            }
                            aggOutput.push(jsonString);
                        }
                    })

                }
                if (aggFields.length == 3) {
                    var aggJSONData = d3.nest()
                        .key(function (d) {
                            return d[aggFields[0]] + ';' + d[aggFields[1]] + ';' + d[aggFields[2]];
                        })
                        .rollup(function (v) {
                            return v.length;
                        })
                        .entries(jsoninput);
                    //console.info(aggJSONData);
                    aggJSONData.forEach(function(a){
                        if(a.key.search(/;/i) > 0){
                            var keys = [];

                            // key 1
                            var key1 = a.key.substring(0,a.key.search(/;/i));
                            keys.push(key1);

                            // Key 2
                            var key2 =  a.key.substring(a.key.search(/;/i)+1, a.key.length);
                            key2 = key2.substring(0, key2.search(/;/i));
                            keys.push(key2);
                            key2 =  a.key.substring(a.key.search(/;/i)+1, a.key.length);

                            // Key 3
                            var key3 = key2.substring(key2.search(/;/i)+1,key2.length);
                            keys.push(key3);

                            var jsonString = {};

                            jsonString[aggFields[0]] = keys[0];
                            jsonString[aggFields[1]] = keys[1];
                            jsonString[aggFields[2]] = keys[2];
                            jsonString['values' ] = a.values;

                            aggOutput.push(jsonString);
                        }
                    })

                }
                if (aggFields.length == 4) {
                    var aggJSONData = d3.nest()
                        .key(function (d) {
                            return d[aggFields[0]] + ';' + d[aggFields[1]] + ';' + d[aggFields[2]] + ';' + d[aggFields[3]];
                        })
                        .rollup(function (v) {
                            return v.length;
                        })
                        .entries(jsoninput);

                    aggJSONData.forEach(function(a){
                        if(a.key.search(/;/i) > 0){
                            var keys = [];

                            // key 1
                            var key1 = a.key.substring(0,a.key.search(/;/i));
                            keys.push(key1);

                            // Key 2
                            var key2 =  a.key.substring(a.key.search(/;/i)+1, a.key.length);
                            key2 = key2.substring(0, key2.search(/;/i));
                            keys.push(key2);
                            key2 =  a.key.substring(a.key.search(/;/i)+1, a.key.length);

                            // Key 3
                            var key3 = key2.substring(key2.search(/;/i)+1,key2.length);
                            key3 = key3.substring(0, key3.search(/;/i));
                            keys.push(key3);
                            key3 = key2.substring(key2.search(/;/i)+1,key2.length);

                            //key4
                            var key4 = key3.substring(key3.search(/;/i)+1, key3.length);
                            keys.push(key4);

                            var jsonString = {};
                            jsonString[aggFields[0]] = keys[0];
                            jsonString[aggFields[1]] = keys[1];
                            jsonString[aggFields[2]] = keys[2];
                            jsonString[aggFields[3]] = keys[3];
                            jsonString['values' ] = a.values;

                            aggOutput.push(jsonString);
                        }
                    })
                }
                if (aggFields.length == 5) {
                    var aggJSONData = d3.nest()
                        .key(function (d) {
                            return d[aggFields[0]] + ';' + d[aggFields[1]] + ';' + d[aggFields[2]] + ';' + d[aggFields[3]] + ';' + d[aggFields[4]];
                        })
                        .rollup(function (v) {
                            return v.length;
                        })
                        .entries(jsoninput);

                    aggJSONData.forEach(function(a){
                        if(a.key.search(/;/i) > 0){
                            var keys = [];

                            // key 1
                            var key1 = a.key.substring(0,a.key.search(/;/i));
                            keys.push(key1);

                            // Key 2
                            var key2 =  a.key.substring(a.key.search(/;/i)+1, a.key.length);
                            key2 = key2.substring(0, key2.search(/;/i));
                            keys.push(key2);
                            key2 =  a.key.substring(a.key.search(/;/i)+1, a.key.length);

                            // Key 3
                            var key3 = key2.substring(key2.search(/;/i)+1,key2.length);
                            key3 = key3.substring(0, key3.search(/;/i));
                            keys.push(key3);
                            key3 = key2.substring(key2.search(/;/i)+1,key2.length);

                            //key4
                            var key4 = key3.substring(key3.search(/;/i)+1, key3.length);
                            key4 = key4.substring(0,key4.search(/;/i));

                            //Key5
                            var key5 = key3.substring(key3.search(/;/i)+1, key3.length);
                            key5 = key5.substring(key5.search(/;/i)+1,key5.length);
                            keys.push(key5);

                            var jsonString = {};
                            jsonString[aggFields[0]] = keys[0];
                            jsonString[aggFields[1]] = keys[1];
                            jsonString[aggFields[2]] = keys[2];
                            jsonString[aggFields[3]] = keys[3];
                            jsonString[aggFields[4]] = keys[4];
                            jsonString['values' ] = a.values;

                            aggOutput.push(jsonString);
                        }
                    })

                }
            return aggOutput
            }

            var aggArray = [];
            aggArray.push('tweetCattegorie');
            aggArray.push('color');

            //dmTweetsPerCattegory
            var dd = JSON.stringify(stgTweetCattegory);
            fs.writeFile('test.json', dd);
            dmTweetsPerCattegory = agg_json_object(aggArray,stgTweetCattegory, 'Y');


            //dmTweetsPerCattegoriePerDay
            var dmTweetsPerCattegoriePerDay = [];
            aggArray = [];
            aggArray.push('tweetCattegorie');
            aggArray.push('color');
            aggArray.push('postDate');

            dmTweetsPerCattegoriePerDay = agg_json_object(aggArray,stgTweetCattegory, 'N');

               res.render('Dashboard/index', {
                               'tweets': stgTweetCattegory,
                               'tweetsPerDay': tweetsPerDay,
                               'domainValues': domainValues,
                               'tweetsPerCattegorry': dmTweetsPerCattegory,
                               'tweetsPerCattegoryPerDay': dmTweetsPerCattegoriePerDay

                       });



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
};






