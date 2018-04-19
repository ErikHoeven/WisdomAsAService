'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    dbBusinessrules = db.get('businessrules'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')

exports.addCategoryVaardighedenResults = function(req, res, next) {
    console.info(' ---- addCategoryVaardighedenResults -------')
    var category = req.body.category, catValues = req.body.catValues, user = req.user, user = {},

    user = req.user || {}

    var searchObject = {typeBusinessRule: "CV_Vaardigheden", username: user.username, tagCattegory : category, cattegoryValue: catValues }
     console.info(searchObject)
     dbBusinessrules.insert(searchObject)

     res.status(200).json({message: 'Categorie criteria succesvol toegevoegd',route:'/admin/', menu:'Category'})
}
