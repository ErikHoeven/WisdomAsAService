/**
 * Created by erik on 3/24/18.
 */


'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    dbCorpus = db.get('corpus'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb')


exports.editDictionaryResults = function(req, res, next) {
    var volledigWerkwoord = req.body.volledigWerkwoord
       ,werkwoordInVerledentijd = req.body.werkwoordInVerledentijd
       ,voltooiddeelwoord = req.body.voltooiddeelwoord
       ,typeWoord = req.body.typeWoord
       ,woord = req.body.woord
       ,volgLetter = req.body.volgLetter
       ,URL =  req.body.URL
       ,id = req.body.id


    dbCorpus.update({_id: id}, {$set: {volledigWerkwoord: volledigWerkwoord
                                            , werkwoordInVerledentijd: werkwoordInVerledentijd
                                            , voltooiddeelwoord: voltooiddeelwoord
                                            , typeWoord:typeWoord
                                            , woord: woord
                                            , volgLetter: volgLetter
                                            , URL: URL }}, false, true)

    res.status(200).json({message: 'Succesvol bijgewerkt'});
}

exports.removeDictionaryResults = function(req, res, next) {
    var id = req.body.id
    dbCorpus.remove({_id: id})
    res.status(200).json({message: 'Succesvol verwijderd'});

}

