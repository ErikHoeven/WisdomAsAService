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
    var inpVaardighedenCategorie = '<select id="selCatVaardigheden">'
    var returnObject = {}

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
                })
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info('-------------- LOCALS.CV -----------------------------')
            console.info(locals.cv)
            console.info('------------------------------------------------------')
            console.info('------------------------CV_Vaardigheden-----------------')
            console.info(locals.catValues)
            console.info('------------------------------------------------------')


            locals.catValues.forEach(function (r) {
                inpVaardighedenCategorie = inpVaardighedenCategorie + '<option value="'+ r.tagCattegory + '">' + r.tagCattegory + '</option>'
            })


            inpVaardighedenCategorie = inpVaardighedenCategorie + '</select>'
            console.info(' BEFORE ERROR (1)')
            console.info(locals.cv[0])
            console.info('---> BEFORE ERROR (2)  <----')
            console.info(' ')

            if(!locals.cv[0].catValues && inpVaardighedenCategorie ) {
                console.info('Geen CV vaardigheden gevonden')
                returnObject.vaardighedenCategorie = inpVaardighedenCategorie
                returnObject.cvCattegorie = 'Geen CV vaardigheden gevonden'
                returnObject.cv = locals.cv[0];
            }

            if(locals.cv[0].catValues){
                console.info('Vaardigheden bestaat')
                returnObject.vaardighedenCategorie = inpVaardighedenCategorie
                returnObject.cvCattegorie = locals.cv[0].catValues
                returnObject.cv = locals.cv[0]
            }

            else{
                console.info('Geen CV vaardigheden gevonden en geen vaardigheden categogie gevonden')
                returnObject.CV_VaardighedenCategorie = inpVaardighedenCategorie
                returnObject.cvCattegorie = 'Geen CV vaardigheden gevonden'
                returnObject.cv = locals.cv[0]
                returnObject.catValues = locals.catValues
            }

            res.status(200).json({returnObject});
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

