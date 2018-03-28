'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    businessrules = db.get('businessrules'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')

exports.addSentimentResults = function(req, res, next) {
        console.info('addDictionaryResults')
        var lookupValue = req.body.lookupValue, user = {}, score = req.body.score
        user = req.user || {}
        var SentimentObject = {"typeBusinessRule" : "Score",
                                "lookupValue" : lookupValue,
                                "score" : score,
                                "username": user}
        console.info(SentimentObject)
        businessrules.insert(SentimentObject)

        res.status(200).json({message: 'Sentiment score succesvol toegevoegd',route:'/admin/', menu:'sentiment'})
}
