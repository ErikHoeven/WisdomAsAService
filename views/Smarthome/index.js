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
    ,dbMeterstanden = db.get('slimmemeter')
    ,moment = require('moment')
    ,underscore = require('underscore')
    ,natural = require('natural')


exports.init = function(req, res, next){
    var user = {}
    user = req.user||{}
    res.render('Smarthome/index',{user: user});
}

exports.getMeterStanden = function (req, res, next) {
    mongo.connect(uri, function (err, db) {
        console.info('MONGODB START CHECK COLLECTIONS')
        var locals = {}, tasks = [
            // Load tmp
            function (callback) {
                db.collection('slimmemeter').find({}).toArray(function (err, meterstanden) {
                    if (err) return callback(err);
                    locals.meterstanden = meterstanden;
                    callback();
                })
            },
                // Load de laatste stand van de dag
                function (callback) {
                    db.collection('slimmemeter').aggregate([{ $match: {Weeknummer:45 }}
                    , { $group: {_id: {Weeknummer: "$Weeknummer", DagNummerVanMaand: "$DagNummerVanMaand"}
                    ,LaatsteDagStandPiek: { $max: "$PiekDag"  },LaatsteDagStandDal: {$max: "$DalDag"}
                    , LaatsteDagStandPiekTerug:{$max: "$PiekTerug"}, LaatsteDagStandDalTerug:{$max: "$DalTerug"}} }]).toArray(function (err, LaatsteDagStand) {
                        if (err) return callback(err);
                        locals.LaatsteDagStand = LaatsteDagStand;
                        callback();
                    });
            }

        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close()
            res.status(200).json({LaatsteStandenPerDag: locals.LaatsteDagStand})
        })
    })
}