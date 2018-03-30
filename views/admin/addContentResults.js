'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    dbContent = db.get('content'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')

exports.saveContentResults = function(req, res, next) {
        console.info('addContentResults')
        var name = req.body.name, user = {}, section = req.body.section, content = req.body.content, id = req.body.id
        user = req.user || {}

        dbContent.update({name: name,"sections.element":section}, {$set: {"sections.$.content" : content}}, false, true)


        res.status(200).json({message: 'Content succesvol opgeslagen',route:'/admin/', menu:'Content'})
}
