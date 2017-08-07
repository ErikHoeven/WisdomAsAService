/**
 * Created by erik on 8/3/17.
 */
'use strict';
var cheerio = require("cheerio")
    ,request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,db = require('monk')('localhost/commevents')
    ,dbm = require('mongodb').MongoClient
    ,d3 = require('d3')
    ,uri = 'mongodb://localhost:27017/commevents'
    ,dbTweets = db.get('STG_LEADS_AUTOSCHADE')


exports.init = function(req, res, next){
    var user = {}
    user = req.user||{}
    res.render('Dashboard/index',{user: user});
}

exports.getTweets = function (req,res,next) {
    console.info('getTWeets')
    var d = new Date()
    d.setHours(0,0,0,0)
    console.info(d.getTime())

    dbTweets.find({"timestamp_ms":{$gte:1502056800000}},function (err,tweets) {
        console.info(tweets.length)

    })
}