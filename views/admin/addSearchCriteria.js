'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    dbBusinessrules = db.get('businessrules'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')

exports.addSearchResults = function(req, res, next) {
        console.info('addSearchResults')
        var name = req.body.name
           ,user = {}
        user = req.user || {}
        var searchObject = {typeBusinessRule: "Zoekwaarde", username: user.username, lookupValue : name}
        console.info(searchObject)
        dbBusinessrules.insert(searchObject)

        res.status(200).json({message: 'Zoek criteria succesvol toegevoegd',route:'/admin/', menu:'search'})
}
