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



exports.editCategoryResults = function(req, res, next) {
    var id = req.body.id
       ,Category = req.body.Category
       ,Color = req.body.Color


    dbBusinessrules.update({_id: id}, {$set: {tagCattegory: Category, Color: Color }}, false, true)
    res.status(200).json({message: 'Succesvol bijgewerkt'});
}

exports.removeCategoryResults = function(req, res, next) {
    var id = req.body.id
    dbBusinessrules.remove({_id: id})
    res.status(200).json({message: 'Succesvol verwijderd'});

}

exports.saveCatValue = function(req, res, next) {
    console.info('----------- saveCatValue -----------------------')

    var  category = req.body.category
        ,pos = req.body.pos
        ,value = req.body.value
        ,color = req.body.color

    console.info(category)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('businessrules').find({tagCattegory: category}).toArray(function (err, businessrules) {
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

            for(var i = 0;i < cattegoryValue.length; i++){
                if(i == pos){
                    cattegoryValue[i] = value
                }
            }

            dbBusinessrules.update({tagCattegory: category}, {$set: {cattegoryValue: cattegoryValue, Color: color }}, false, true)



            res.status(200).json({message: 'succesvol opgeslagen', cat: category});
        })
    })
}

