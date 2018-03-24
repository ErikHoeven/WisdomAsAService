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



exports.editSearchResults = function(req, res, next) {
    var id = req.body.id
       ,field = req.body.field
       ,value = req.body.value
       ,updateObject = {}

        updateObject[field] = value

        console.info(updateObject)


    dbBusinessrules.update({_id: id}, {$set: updateObject}, false, true)
    res.status(200).json({message: 'Succesvol bijgewerkt'});
}

exports.removeSearchResults = function(req, res, next) {
    var id = req.body.id
    dbBusinessrules.remove({_id: id})
    res.status(200).json({message: 'Succesvol verwijderd'});

}

