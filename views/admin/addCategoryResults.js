'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    dbBusinessrules = db.get('businessrules'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')

exports.addCategoryResults = function(req, res, next) {
    console.info('addCategoryResults')
    var category = req.body.category, color = req.body.color, catValues = req.body.catValues, user = req.user, user = {},

    user = req.user || {}

    var searchObject = {typeBusinessRule: "Cattegorie", username: user.username, tagCattegory : category, cattegorycolor: color, cattegoryValue: catValues }
     console.info(searchObject)
     dbBusinessrules.insert(searchObject)

     res.status(200).json({message: 'Categorie criteria succesvol toegevoegd',route:'/admin/', menu:'Category'})
}
