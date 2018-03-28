'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    employees = db.get('employees'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')

exports.addEmployeeResults = function(req, res, next) {
        console.info('addEmployeeResults')
        var firstname = req.body.firstname, user = {}, role = req.body.role, lastname = req.body.lastname,  percFullTime = req.body.percFullTime
        user = req.user || {}
        var EmployeeObject = {"firstname" : firstname,
                            "lastname" : lastname,
                            "role" : role,
                            "percFullTime" : percFullTime,
                            "username": user}
        console.info(EmployeeObject)
        employees.insert(EmployeeObject)

        res.status(200).json({message: 'Medewerker succesvol toegevoegd',route:'/admin/', menu:'employee'})
}
