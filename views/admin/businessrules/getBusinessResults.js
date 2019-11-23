/**
 * Created by erik on 12/2/17.
 */
'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb')
    //underscore = require('bower_components/underscore/underscore')



exports.getBusinesgetBusinessRulesCattegoriesRules = function(req, res, next) {
        console.info('------------------------- getBusinessRules -------------------------')
        mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = [], lookupterm = req.body.term
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('businessrules').find({tagCattegory: "Inkomstenbelasting"}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info(locals.businessrules[0].cattegoryValue)

            var brCatList = locals.businessrules[0].cattegoryValue
            var optionList = '<SELECT id="InkomstenbelastingOnderdeel">'
            brCatList.forEach(function (r) {
                optionList = optionList + '<option value="' + r + '">' + r + '</option>'
            })
            optionList = optionList + '</select>'

            var businessRuleform =
                '<div class=\"col-lg-12\">'
                + '<div class="businessrules-form">'
                + '<form>'
                + '<div class="form-group">'
                + '<div class="input-group">'
                + '<label class="col-form-label">Scenario:</label>'
                + '</div>'
                + '<div class="input-group">'
                + '<input type="text"  id="ScenarioName"></input>'
                + '</div>'
                + '</div>'

                + '<div class="form-group">'
                + '<div class="input-group">'
                + ' <label class="col-form-label">Inkomstenbelasting onderdeel:</label>'
                + '</div>'
                + '<div class="input-group">'
                + optionList
                + '</div>'
                + '</div>'

                + '<div class="form-group">'
                + '<div class="input-group">'
                + '<label class="col-form-label">Onderdeel positie:</label>'
                + '</div>'
                + '<div class="input-group">'
                + '<input type="text"  id="OnderdeelPositie" size="4"></input>'
                + '</div>'
                + '</div>'

                + '<div class="form-group">'
                    + '<div class="input-group">'
                            + '<button type="button" class="btn btn-primary" id="cmdAddExpresion">Expresion</button>'
                    + '</div>'
                + '</div>'
            res.status(200).json({businessRuleform});
        })
    })
}

