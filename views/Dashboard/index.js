/**
 * Created by erik on 8/3/17.
 */
'use strict';
var  cheerio = require("cheerio")
    ,request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,db = require('monk')('localhost/commevents')
    ,dbm = require('mongodb').MongoClient
    ,d3 = require('d3')
    ,uri = 'mongodb://localhost:27017/commevents'
    ,dbTweets = db.get('STG_LEADS_AUTOSCHADE')
    ,moment = require('moment')
    ,underscore = require('underscore')
    ,natural = require('natural')


exports.init = function(req, res, next){
    var user = {}
    user = req.user||{}
    res.render('Dashboard/index',{user: user});
}

exports.getTweets = function (req, res, next) {
    console.info('getTWeets')

    var  actMonth = actualMonth()
       , startMonth = new Date(actMonth.startMonth)
       , endMonth = new Date(actMonth.endMonth)
       , actWeek = actualWeek()
       , startMonth = new Date(actMonth.startMonth)
       , twMonthClean = []
       , isFavourited = 0
       , isRetweeted =  0
       , graphArrayDayTweets = []
       , i = 0
       , lstUserPerMonth = []



    startMonth = moment(startMonth).format('MM-DD-YYYY')
    startMonth = new Date (startMonth)
    endMonth = moment(endMonth).format('MM-DD-YYYY')
    endMonth = new Date (endMonth)

    mongo.connect(uri, function (err, db) {
        console.info('MONGODB START CHECK COLLECTIONS')
        var locals = {}, tasks = [
            // Load tmp
            function (callback) {
                db.collection('STG_LEADS_AUTOSCHADE').find({created_at:{$gt: startMonth, $lt: endMonth}}).toArray(function (err, tweets) {
                    if (err) return callback(err);
                    locals.tweetsActMonth = tweets;
                    callback();
                })
            },
            function (callback) {
                db.collection('businessrules').find({typeBusinessRule:'WordCloudExceptions'},{lookupValue:1}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.fltrWordCloud = businessrules;
                    callback();
                })
            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            var fltrWordCloud = [], twMonth = []
            db.close()
            fltrWordCloud = locals.fltrWordCloud, twMonth = locals.tweetsActMonth

            //(1) Clean tweet for reportng purpose ->  twMonthClean[]
            twMonth.forEach(function (tweet) {
                tweet.created_at = moment(tweet.created_at).format('MM-DD-YYYY')
                tweet.retweeted = isRetweeted
                tweet.favorited = isFavourited
                tweet.all = 'all'

                if (tweet.retweeted == true) { tweet.retweeted = 1}
                if (tweet.favorited == true) { tweet.favorited = 1}

                twMonthClean.push(tweet)

            })

            // (2) Aggegrate the whole month on twMonthClean[]
            var allTweetsPerMonth = d3.nest()
                .key(function(d) { return d.all; })
                .rollup(function(v) { return {
                    count: v.length,
                    likesPerDay: d3.sum(v, function(d) { return d.retweeted; }),
                    retweetsPerDay : d3.sum(v, function(d) { return d.favorited; })
                }; })
                .entries(twMonthClean);

            console.info(allTweetsPerMonth)

            console.info('----------------------------------------------------------------')

            // (3) Aggegrate the day on twMonthClean[]
            var dayTweetCount = d3.nest()
                .key(function(d) { return d.created_at; })
                .rollup(function(v) { return {
                    count: v.length,
                    likesPerDay: d3.sum(v, function(d) { return d.retweeted; }),
                    retweetsPerDay : d3.sum(v, function(d) { return d.favorited; })
                }; })
                .entries(twMonthClean);


            dayTweetCount.forEach(function (day) {
                graphArrayDayTweets.push({date: moment(dayTweetCount[i].key,'MM-DD-YYYY').toDate(), value: day.values.count})
                i++
            })

            console.info(graphArrayDayTweets)
            console.info('----------------------------------------------------------------')

            twMonthClean.forEach(function (tw) {
                lstUserPerMonth.push(tw.user.name)
            })

            var uniqueUsers = underscore.uniq(lstUserPerMonth)
            console.info(uniqueUsers.length)

            console.info('----------------------------------------------------------------')
            var wordList,wordArray = []

            for (var counter = 0; counter < twMonthClean.length; counter++){
                wordList = setSentenceToWord(twMonthClean[counter].text)
                wordArray = wordArray.concat(wordList)
            }


            //console.info(fltrWordCloud)
            var wordCloud = fltrWordCountList(wordArray,5,fltrWordCloud)

            //console.info(wordCloud)


            res.status(200).json({tweets:allTweetsPerMonth
                , graphArrayDayTweets: graphArrayDayTweets
                , uniqueUsers: uniqueUsers.length
                , wordCloud: wordCloud
            })
        })
    })
}




function actualWeek() {
    var d = new Date();
    var nlWeekStartNumber = 1;
    var nlWeekEndNumber = 6;
    var DayCounter = d.getDay();
    var startWeekDay = d.getDate();
    var endWeekDay = d.getDate();
    var startWeekDate = new Date();
    var endWeekDate = new Date();

    for (DayCounter; DayCounter > nlWeekStartNumber; DayCounter--) {
        startWeekDay--;
    }

    for (DayCounter = d.getDay(); DayCounter < nlWeekEndNumber; DayCounter++) {
        endWeekDay++;
    }

    startWeekDate = new Date(startWeekDate.setDate(startWeekDay));
    endWeekDate = new Date(endWeekDate.setDate(endWeekDay + 1));


    return {
        'startWeekDay': startWeekDate
        , 'endWeekDay': endWeekDate
    }
}

function actualMonth() {
    //Is het aantal weken in een maand (met begin en eind datum)
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


    return {
        'startMonth': firstDay
        , 'endMonth': lastDay
    }

}

function setSentenceToWord(tweetsText) {
    var tokenizer = new natural.WordTokenizer();

    return tokenizer.tokenize(tweetsText)

}


function fltrWordCountList(wordCloud, filterCount, fltrList) {
    var returnList = [], wordCloudDef = [], compareWord = null, count = 0
    // (1) Sort the words
    wordCloud.sort();

    // (2) Count the words
    wordCloud.forEach(function (word) {

        if(word != compareWord && count == 0){
            compareWord = word
        }

        if(word == compareWord){
            if (count == 0){
                count++
            }
            else {
                count++
            }
        }

        if (word != compareWord && count > 0){
            wordCloudDef.push({word: word, count: count + 1})
            count = 0
            compareWord = word
        }
    })

    wordCloudDef.forEach(function (word) {
        if(word.count >= filterCount){
            returnList.push(word)
        }

    })

    wordCloud = [], compareWord = 0

    if (fltrList != null){
        returnList.forEach(function (rrl) {
            fltrList.forEach(function (frl) {
                //console.info(rrl.word + ' =! ' + frl.lookupValue)
                if (rrl.word != frl.lookupValue){
                    compareWord = 1
                }
            })
            if (compareWord == 1){
                wordCloud.push(rrl)
                compareWord = 0
                console.info(rrl)
            }


        })
        return wordCloud
    }
    else {
        return returnList
    }
}