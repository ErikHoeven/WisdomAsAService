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

    console.info(endMonth)
    console.info(startMonth)

    dbTweets.find({created_at:{$gt: startMonth, $lt: endMonth}},function (error,twMonth) {

        twMonth.forEach(function (tweet) {
            tweet.created_at = moment(tweet.created_at).format('MM-DD-YYYY')
            tweet.retweeted = isRetweeted
            tweet.favorited = isFavourited
            tweet.all = 'all'

            if (tweet.retweeted == true) { tweet.retweeted = 1}
            if (tweet.favorited == true) { tweet.favorited = 1}

            twMonthClean.push(tweet)

        })

        var allTweetsPerMonth = d3.nest()
            .key(function(d) { return d.all; })
            .rollup(function(v) { return {
                count: v.length,
                likesPerDay: d3.sum(v, function(d) { return d.retweeted; }),
                retweetsPerDay : d3.sum(v, function(d) { return d.favorited; })
            }; })
            .entries(twMonthClean);

        console.info(allTweetsPerMonth)

        console.info('-------------------------------------------')

        var dayTweetCount = d3.nest()
            .key(function(d) { return d.created_at; })
            .rollup(function(v) { return {
                count: v.length,
                likesPerDay: d3.sum(v, function(d) { return d.retweeted; }),
                retweetsPerDay : d3.sum(v, function(d) { return d.favorited; })
            }; })
            .entries(twMonthClean);

        console.info(dayTweetCount)

        console.info('-------------------------------------------')


        dayTweetCount.forEach(function (day) {
            graphArrayDayTweets.push({date: moment(dayTweetCount[i].key,'MM-DD-YYYY').toDate(), value: day.values.count})
            i++
        })

        twMonthClean.forEach(function (tw) {
            lstUserPerMonth.push(tw.user.name)
        })

        var uniqueUsers = underscore.uniq(lstUserPerMonth)




        console.info(graphArrayDayTweets)
        res.status(200).json({tweets:allTweetsPerMonth, graphArrayDayTweets: graphArrayDayTweets, uniqueUsers: uniqueUsers.length})
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


function  sendToFrontEnd(message) {

    res.render('Dashboard/index',{message: message})

}