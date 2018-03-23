'use strict';
var  request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,d3 = require('d3')
    ,uri = 'mongodb://localhost:27017/commevents'
    ,moment = require('moment')
    ,underscore = require('underscore')
    ,ftlrGroup = []
    ,fltrState = []
    ,compareWordGroup = null
    ,compareWordState = null
    ,locals = {}



exports.init = function(req, res, next) {
    var user = {}
    user = req.user || {}
    res.render('admin/adminHome', {user: user});
}


exports.start = function(req, res, next) {
    var user = {}
    user = req.user || {}

    console.info('-------------------Start Tickets Parameters--------------------------------------------------------')
    var snapshot = moment(req.body.snapshot) //--> add as filter to the queries except the trends.
    console.info(snapshot)
    var snapshotweek = moment(req.body.snapshot, 'YYYY-MM-DD').week()
    console.info(snapshotweek)
    if (req.body.filter) {
        var filter = req.body.filter
    }
    console.info('-------------------End Tickets Parameters--------------------------------------------------------')

    mongo.connect(uri, function (err, db) {
        console.info('MONGODB START CHECK COLLECTIONS')
        var tasks = [
            // Load STG_LEADS_AUTOSCHADE twitterfeeds
            function (callback) {
                db.collection('STG_LEADS_AUTOSCHADE').count({},function (err, totalFeeds) {
                    if (err) return callback(err);
                    locals.totalFeeds = totalFeeds;
                    callback();
                });
            },
            // Load businessrules - dictionary
            function (callback) {
                db.collection('corpus').count({}, function (err, totalWordsinCorpus) {
                    if (err) return callback(err);
                    locals.totalWordsinCorpus = totalWordsinCorpus;
                    callback();
                });
            },
            // Load businessrules - employees
            function (callback) {
                db.collection('businessrules').find({typeBusinessRule: "maintenanceAssignment"}).count({},function (err, totEmployees){
                    if (err) return callback(err);
                    locals.totEmployees = totEmployees;
                    callback();
                });
            },
            // Load omnitracker
            function (callback) {
                db.collection('stgOmniTracker').find({State: "Classification"}).count({},function (err, totTickets){
                    if (err) return callback(err);
                    locals.totTickets = totTickets;
                    callback();
                });
            },
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);

            res.status(200).json({user: user, counts: locals});

        })
    })
}








