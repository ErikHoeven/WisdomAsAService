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
    console.info('---------------------saveCVPeronalia --------------------------------')
    var voornaam  = req.body.voornaam
    var achternaam = req.body.achternaam
    var titel =  req.body.titel
    var woonplaats =  req.body.woonplaats
    var user

    user = req.user || {}
    var cvPersonaliaObject = {voornaam: voornaam, achternaam: achternaam, titel:titel, woonplaats:woonplaats, lastUpdateDate: Date(), user:user }
    dbCV.insert(cvPersonaliaObject)

   res.status(200).json({message: 'Zoek Personalia succesvol toegevoegd',route:'/admin/', menu:'cvProfiel' })

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
    console.info('------------------ updateProfiel ---------------------------------')
    console.info('roleProfiles')
    console.info(roleProfiles)
    console.info('brancheProfiles')
    console.info(brancheProfiles)
    console.info('id')
    console.info(id)

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
        res.status(200).json({message: 'Ontbrekend CV'});
    }

}


exports.getCV= function (req,res,next) {
     var voornaam = req.body.voornaam
     var achternaam = req.body.achternaam

    console.info('----------- GETCV --------------')

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('CV').find({voornaam: voornaam, achternaam:achternaam}).toArray(function (err, cv) {
                    if (err) return callback(err);
                    locals.cv = cv;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            res.status(200).json({cv: locals.cv })

        })
    })

}

exports.getCVByID = function (req,res,next) {
    var id = req.body.id

    console.info('----------- getCVByID --------------')
    console.info('ID: ' + id )
    var o_id = new mongo.ObjectID(id);
    console.info('-------------------------')
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
            res.status(200).json({cv: locals.cv })

        })
    })

}

exports.removeBranche = function(req,res,next){
    console.info('----------------- removeBranche ---------------------')
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
            var branche = cv[0].brancheProfiles
            var newBranche = []

            for( var i = 0; i < branche.length;i++){
                if (i != row){
                    console.info(i + ' !== ' + row)
                    newBranche.push(branche[i])
                }
            }
            console.info('NewBranche:')

            cv[0].brancheProfiles = newBranche
            dbCV.update({_id: id}, {$set: {brancheProfiles: newBranche}}, false, true)
            res.status(200).json({cv: cv })
        })
    })
}

exports.removeRole = function(req,res,next){
    console.info('----------------- remove roleProfiles ---------------------')
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
            var Roles = cv[0].roleProfiles
            var newRoles = []

            for( var i = 0; i < Roles.length;i++){
                if (i != row){
                    console.info(i + ' !== ' + row)
                    newRoles.push(Roles[i])
                }
            }
            console.info('NewRole:')

            cv[0].roleProfiles = newRoles
            dbCV.update({_id: id}, {$set: {roleProfiles: newRoles}}, false, true)
            res.status(200).json({cv: cv })
        })
    })
}


