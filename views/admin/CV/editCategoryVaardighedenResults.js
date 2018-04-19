/**
 * Created by erik on 3/24/18.
 */


'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    dbBusinessrules = db.get('businessrules'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')



exports.editCategoryVaardighedenResults = function(req, res, next) {
    var id = req.body.id
       ,Category = req.body.Category

    dbBusinessrules.update({_id: id}, {$set: {tagCattegory: Category, typeBusinessRule: "CV_Vaardigheden" }}, false, true)
    res.status(200).json({message: 'Succesvol bijgewerkt'});
}

exports.removeCategoryVaardighedenResults = function(req, res, next) {
    console.info('---------------------  removeCategoryVaardighedenResults --------------------')
    var id = req.body.id
    dbBusinessrules.remove({_id: id})
    res.status(200).json({message: 'Succesvol verwijderd'});

}

exports.saveCatVaardighedenValue = function(req, res, next) {
    console.info('----------- saveCatValue -----------------------')

    var  category = req.body.category
        ,pos = req.body.pos
        ,value = req.body.value

    console.info(category)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('businessrules').find({$and:[{tagCattegory: category},{typeBusinessRule: "CV_Vaardigheden"}]}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            var cattegoryValue = locals.businessrules[0].cattegoryValue

            if (pos < cattegoryValue.length){
                for(var i = 0;i < cattegoryValue.length; i++){
                    if(i == pos){
                        cattegoryValue[i] = value
                    }
                }
            }
            else{
                for(var i = 0;i <= pos; i++){
                    if(i == pos){
                        cattegoryValue[i] = value
                    }
                }
            }
            dbBusinessrules.update({tagCattegory: category}, {$set: {cattegoryValue: cattegoryValue, typeBusinessRule: "CV_Vaardigheden" }}, false, true)

            res.status(200).json({message: 'succesvol opgeslagen', cat: category});
        })
    })
}

exports.removeCatVaardighedenValue = function(req, res, next) {
    console.info('----------- RemoveeCatValue -----------------------')

    var  category = req.body.tagCattegory
        ,pos = req.body.pos


    console.info(category)
    console.info(pos)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('businessrules').find({$and:[{tagCattegory: category},{typeBusinessRule: "CV_Vaardigheden"}]}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            var cattegoryValue = locals.businessrules[0].cattegoryValue
            cattegoryValue.splice(pos)


            dbBusinessrules.update({tagCattegory: category}, {$set: {cattegoryValue: cattegoryValue, typeBusinessRule: "CV_Vaardigheden"}}, false, true)

            res.status(200).json({message: 'succesvol verwijderd', cattegoryValue: cattegoryValue});
        })
    })
}