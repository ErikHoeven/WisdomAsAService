'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    inkomstenbelasting = db.get('inkomstenbelasting')
//underscore = require('bower_components/underscore/underscore')


exports.saveExpresion = function(req, res, next) {
    console.info('------------------------- saveExpresion ------------------------------------------------')
    console.info('req.body.ScenarioName')
    console.info(req.body.ScenarioName)
    var ScenarioName = req.body.ScenarioName
    var brObject = req.body.object

    console.info('ScenarioName: ' + ScenarioName)
    console.info('-- new Object --')
    console.info(brObject)



    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            function (callback) {
                db.collection('inkomstenbelasting').find({ScenarioName:ScenarioName}).toArray(function (err, Businessrules) {
                    if (err) return callback(err);
                    locals.Businessrules = Businessrules;
                    callback();
                })
            }
        ]
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info('(2) GetBusinessRules:')
            console.info(locals.Businessrules.length)

            if(locals.Businessrules.length > 0){
                console.info('business rule does exist. Add element to expresion list')
                var exprList = locals.Businessrules[0].Expresions[0].ExpresionLines
                exprList.push(brObject.Expresions[0].ExpresionLines[0])
                console.info(exprList)

                brObject.expresions = exprList
                console.info('ScenarioName:' + ScenarioName)
                inkomstenbelasting.update({ScenarioName: ScenarioName}, {$set: {"Expresions.0.ExpresionLines" : exprList}}, false, true)
                res.status(200).json({object:brObject});


            }
            else{
                console.info('business rule does not exist.')
                console.info('Insert Object')
                var object = req.body.object
                console.info('-----------(D)------------')
                console.info(object.Expresions[0].ExpresionDefinition)
                console.info('------------(D)-----------')
                inkomstenbelasting.insert(req.body.object)
                res.status(200).json({message:'saved succesfully,', ExpresionDefinition: object.Expresions[0].ExpresionDefinition});
                console.info('------------------------- end saveExpresion ------------------------------------------------')
            }



        })
    })
}

exports.saveCalculation = function(req, res, next) {
    console.info('------------------------- saveCalculation (A) ------------------------------------------------')
    var ScenarioName = req.body.ScenarioName
    var brObject = req.body.brResult
    console.info('')
    console.info('------------------------- saveCalculation (PROPERTIES) ------------------------------------------------')
    console.info('ScenarioName: ' + ScenarioName)
    console.info('-- new Object --')
    console.info(brObject)
    console.info('')
    console.info('------------------------- saveCalculation (DB) ------------------------------------------------')
    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            function (callback) {
                db.collection('inkomstenbelasting').find({ScenarioName:ScenarioName}).toArray(function (err, Businessrules) {
                    if (err) return callback(err);
                    locals.Businessrules = Businessrules;
                    callback();
                })
            }
        ]
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info('(2) GetBusinessRules:')
            inkomstenbelasting.update({ScenarioName: ScenarioName}, {$set: {"Expresions.0.Results" : brObject}}, false, true)
            res.status(200).json({object:brObject, });
        })
    })
}








