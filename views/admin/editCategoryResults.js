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



exports.editCategoryResults = function(req, res, next) {
    var id = req.body.id
       ,Category = req.body.Category
       ,Color = req.body.Color


    dbBusinessrules.update({_id: id}, {$set: {tagCattegory: Category, Color: Color }}, false, true)
    res.status(200).json({message: 'Succesvol bijgewerkt'});
}

exports.removeCategoryResults = function(req, res, next) {
    var id = req.body.id
    dbBusinessrules.remove({_id: id})
    res.status(200).json({message: 'Succesvol verwijderd'});

}

exports.testAdmin = function(req, res, next) {
        console.info('-------------- Test ------------------------')
        var user = {}
        user = req.user || {}
        res.render('admin/testAdmin', {user: user});

}
