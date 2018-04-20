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

exports.getVaardigheden = function (req, res, next) {
    console.info('--------------------- getVaardigheden -----------------------------------')
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
            },
            function (callback) {
                db.collection('businessrules').find({typeBusinessRule: "CV_Vaardigheden"}).toArray(function (err, catValues) {
                    if (err) return callback(err);
                    locals.catValues = catValues;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info(locals.cv)

            res.status(200).json({cv: locals.cv[0],catValues:locals.catValues});

        })
    })
}

exports.saveVaardigheden = function (req, res, next) {
    var id = req.body.id
    var vaardigheden = req.body.vaardigheden
    console.info(vaardigheden)

    if(id)
    {
        dbCV.update({_id: id}, {
            $set: {
                vaardigheden: vaardigheden,
                lastUpdateDate: Date()
            }
        }, false, true)
        res.status(200).json({message: 'Succesvol bijgewerkt'});
    }
    else {
        res.status(200).json({message: 'Velden ontbreken'});
    }


}