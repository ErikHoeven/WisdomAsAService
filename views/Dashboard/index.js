'use strict'


exports.find = function(req, res, next){
    console.info('find tweets: ...')
    var mongo = require('mongodb');
    var db = require('monk')('localhost/commevents');
    var tweets = db.get('STG_LEADS_AUTOSCHADE');
    tweets.find({},{},function (err,tweets){
        res.render('Dashboard/index',{'tweets': tweets });
    });





};





