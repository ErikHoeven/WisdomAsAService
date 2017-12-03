/**
 * Created by erik on 12/3/17.
 */
'use strict';
var async = require('async'),
    db = require('monk')('localhost/commevents'),
    businessrules = db.get('businessrules'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb')


exports.addDeveloperToBusinessRules = function (req, res, next) {
    var value = req.body.value
    console.info(value)
    businessrules.insert(value)
    res.status(200).json({message: 'Succesfull added'})
}