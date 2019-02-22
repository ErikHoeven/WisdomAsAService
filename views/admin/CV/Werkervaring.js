/**
 * Created by erik on 4/13/18.
 */
'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    dbCV = db.get('CV'),
    moment = require('moment'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')

exports.getWerkervaring = function (req, res, next) {
    console.info('--------------------- getPeronalia -----------------------------------')
    var id = req.body.id
    console.info(id)
    var o_id = new mongo.ObjectId(id)
    console.info(o_id)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('CV').find({_id: o_id}).toArray(function (err, cv) {
                    if (err) return callback(err);
                    locals.cv = cv;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info(locals.cv)

            res.status(200).json({cv: locals.cv[0]});

        })
    })
}

exports.saveWerkervaring = function (req, res, next) {
    var id = req.body.id
    var werkervaring = req.body.werkervaring

    if(id)
    {
        dbCV.update({_id: id}, {
            $set: {
                werkervaring: werkervaring,
                lastUpdateDate: Date()
            }
        }, false, true)
        res.status(200).json({message: 'Succesvol bijgewerkt'});
    }
    else {
        res.status(200).json({message: 'Velden ontbreken'});
    }


}

exports.removeWerkervaring = function(req,res,next){
    console.info('----------------- remove roleWerkervaring ---------------------')
    var id = req.body.id
    var row = req.body.row
    var o_id = new mongo.ObjectID(id)
    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('CV').find({_id: o_id}).toArray(function (err, cv) {
                    if (err) return callback(err);
                    locals.cv = cv;
                    callback();
                });
            }
        ];
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            var cv = locals.cv
            var werkervaring = cv[0].werkervaring
            var newWerkervaring = []

            for( var i = 0; i < werkervaring.length;i++){
                if (i != row){
                    console.info(i + ' !== ' + row)
                    newWerkervaring.push(werkervaring[i])
                }
            }
            console.info('NewWerkervaring:')
            console.info(newWerkervaring)
            console.info('set newWerkervaring')
            cv[0].werkervaring = newWerkervaring
            console.info('update')
            dbCV.update({_id: id}, {$set: {werkervaring: newWerkervaring}}, false, true)
            console.info('send cv')
            res.status(200).json({cv: cv })
        })
    })
}