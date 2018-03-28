/**
 * Created by erik on 3/24/18.
 */


'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    employees = db.get('employees'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb')


exports.editEmployeeResults = function(req, res, next) {
    var firstname = req.body.firstname
       ,lastname = req.body.lastname
       ,role = req.body.role
       ,percFullTime = req.body.percFullTime
       ,id = req.body.id

    console.info({_id: id, firstname: firstname, lastname: lastname, role: role, percFullTime:percFullTime})

    employees.update({_id: id}, {$set: {firstname: firstname
                                            , lastname: lastname
                                            , role: role
                                            , percFullTime:percFullTime
                                           }}, false, true)

    res.status(200).json({message: 'Succesvol bijgewerkt'});
}

exports.removeEmployeeResults = function(req, res, next) {
    var id = req.body.id
    employees.remove({_id: id})
    res.status(200).json({message: 'Succesvol verwijderd'});

}

