'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    inkomstenbelasting = db.get('inkomstenbelasting')


exports.getBusinessRule = function(req, res, next) {
    console.info('-----------------------   (B)getBusinessRule(B)  -------------------------------------')
    //var brName = req.body.brName


    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            function (callback) {
                db.collection('inkomstenbelasting').find({}).toArray(function (err, Businessrules) {
                    if (err) return callback(err);
                    locals.Businessrules = Businessrules;
                    callback();
                })
            }
        ]
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info('locals.Businessrules')
            console.info(locals.Businessrules)
            var optionSelect = '<select id="ExprName" onchange="formGetResult()" onselect="formGetResult()" onfocus="formGetResult()">'
            var optionList = ''

            locals.Businessrules.forEach(function (r) {
                console.info('Loop')
                console.info(r.results.ExpresionCalc)
                console.info(r)
                optionList = optionList + '<option value=' + r.BusinessRule + '>' + r.BusinessRule + '</option>'
            })

            optionSelect = optionSelect + optionList + '</select>'
            console.info(optionList)
            res.status(200).json({message: optionSelect});
        })
    })
}

exports.getBusinessRuleResult = function(req, res, next) {
    console.info('-----------------------   (B)getBusinessRule(B)  -------------------------------------')
    var brName = req.body.srgBusinessRules

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            function (callback) {
                db.collection('inkomstenbelasting').find({BusinessRule:brName}).toArray(function (err, Businessrules) {
                    if (err) return callback(err);
                    locals.Businessrules = Businessrules;
                    callback();
                })
            }
        ]
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info(locals.Businessrules[0].results)
            res.status(200).json({message: locals.Businessrules[0].results});

        })
    })
}

