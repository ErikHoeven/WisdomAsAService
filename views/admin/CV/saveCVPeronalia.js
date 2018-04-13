/**
 * Created by erik on 4/10/18.
 */

'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    dbCV = db.get('CV'),
    moment = require('moment'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')

exports.saveCVPeronalia = function(req, res, next) {

    var voornaam  = req.body.voornaam
    var achternaam = req.body.achternaam
    var titel =  req.body.titel
    var woonplaats =  req.body.woonplaats
    var user

    user = req.user || {}
    var cvPersonaliaObject = {voornaam: voornaam, achternaam: achternaam, titel:titel, woonplaats:woonplaats, lastUpdateDate: Date(), user:user }
    console.info(cvPersonaliaObject)
    dbCV.insert(cvPersonaliaObject)

    res.status(200).json({message: 'Zoek Personalia succesvol toegevoegd',route:'/admin/', menu:'cvProfiel'})
}


exports.getPeronalia = function (req, res, next) {
        console.info('--------------------- getPeronalia -----------------------------------')
        var id = req.body.id
        var o_id = new mongo.ObjectId(id)


    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('CV').find({_id: o_id}).toArray(function (err, cvs) {
                    if (err) return callback(err);
                    locals.cvs = cvs;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info(locals.cvs)

            res.status(200).json({cv: locals.cvs});

        })
    })
}


exports.updateCVPeronalia = function(req, res, next) {

    var voornaam  = req.body.voornaam
    var achternaam = req.body.achternaam
    var titel =  req.body.titel
    var woonplaats =  req.body.woonplaats
    var user
    var id = req.body.id

    user = req.user || {}
    var cvPersonaliaObject = {voornaam: voornaam, achternaam: achternaam, titel:titel, woonplaats:woonplaats, lastUpdateDate: Date(), user:user }

    dbCV.update({_id: id}, {$set: {voornaam: voornaam, achternaam: achternaam, titel:titel, woonplaats:woonplaats, lastUpdateDate: Date(), user:user }}, false, true)
    res.status(200).json({message: 'Succesvol bijgewerkt'});

}


exports.updateCVProfile = function (req, res, next) {
     var roleProfiles =  req.body.roleProfiles
     var brancheProfiles = req.body.brancheProfiles
     var id = req.body.id

    if(id)
    {
        dbCV.update({_id: id}, {
            $set: {
                roleProfiles: roleProfiles,
                brancheProfiles: brancheProfiles,
                lastUpdateDate: Date()
            }
        }, false, true)
        res.status(200).json({message: 'Succesvol bijgewerkt'});
    }
    else {
        res.status(200).json({message: 'Velden ontbreken'});
    }

}