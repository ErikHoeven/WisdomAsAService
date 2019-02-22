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

exports.getOpleiding = function (req, res, next) {
    console.info('--------------------- getPeronalia -----------------------------------')
    var id = req.body.id
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

exports.saveOpleiding = function (req, res, next) {
    var id = req.body.id
    var opleiding = req.body.opleiding
    console.info(opleiding)

    if(id)
    {
        dbCV.update({_id: id}, {
            $set: {
                opleiding: opleiding,
                lastUpdateDate: Date()
            }
        }, false, true)
        res.status(200).json({message: 'Succesvol bijgewerkt'});
    }
    else {
        res.status(200).json({message: 'Velden ontbreken'});
    }


}

exports.removeOpleiding = function(req,res,next){
    console.info('----------------- remove roleOpleiding ---------------------')
    var id = req.body.id
    var row = req.body.row
    console.info(id)
    console.info(row)
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
            var Opleidingen = cv[0].opleiding
            var newOpleidingen = []

            for( var i = 0; i < Opleidingen.length;i++){
                if (i != row){
                    console.info(i + ' !== ' + row)
                    newOpleidingen.push(Opleidingen[i])
                }
            }
            console.info('NewOpleiding:')

            cv[0].opleiding = newOpleidingen
            dbCV.update({_id: id}, {$set: {opleiding: newOpleidingen}}, false, true)
            res.status(200).json({cv: cv })
        })
    })
}