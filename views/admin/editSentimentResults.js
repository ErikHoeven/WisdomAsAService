/**
 * Created by erik on 3/24/18.
 */


'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    businessrules = db.get('businessrules'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb')


exports.editSentimentResults = function(req, res, next) {
    var lookupValue = req.body.lookupValue, user = {}, score = req.body.score, id = req.body.id
    user = req.user || {}


    businessrules.update({_id: id}, {$set: {lookupValue: lookupValue, score: score }}, false, true)

    res.status(200).json({message: 'Succesvol bijgewerkt'});
}

exports.removeSentimentResults = function(req, res, next) {
    var id = req.body.id
    businessrules.remove({_id: id})
    res.status(200).json({message: 'Succesvol verwijderd'});

}

