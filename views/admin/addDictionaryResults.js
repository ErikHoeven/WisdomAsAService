'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    dbCorpus = db.get('corpus'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')

exports.addDictionaryResults = function(req, res, next) {
        console.info('addDictionaryResults')
        var word = req.body.word, user = {}, typeWord = req.body.typeWord
        user = req.user || {}
        var DictionaryObject = {"volledigWerkwoord" : "",
                            "werkwoordInVerledentijd" : "",
                            "voltooiddeelwoord" : "",
                            "typeWoord" : typeWord,
                            "woord" : word,
                            "volgLetter" : word.substring(0,1),
                            "URL" : "handmatig"}
        console.info(DictionaryObject)
        dbCorpus.insert(DictionaryObject)

        res.status(200).json({message: 'Zoek criteria succesvol toegevoegd',route:'/admin/', menu:'dictionary'})
}
