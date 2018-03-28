/**
 * Created by erik on 12/2/17.
 */
'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')



exports.getEmployeeResults = function(req, res, next) {
        console.info('------------------------- getSearchResults -------------------------')
        var lookupterm = req.body.term


        mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('employees').find({$and:[{$or:[{"firstname": {$regex: ".*" + lookupterm + ".*"}},{"lastname": {$regex: ".*" + lookupterm + ".*"}}]}]}).toArray(function (err, employees) {
                    if (err) return callback(err);
                    locals.employees = employees;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();

            var   theader = ''
                , tbody = ''
                , optionlist = ''
                , table = ''
                , columns = ['Voornaam','Achternaam','Rol','Percentage werkzaam voltijd']
                , body = setBody(locals.employees)
                , header = setHeader(columns)

            console.info(body)

            res.status(200).json({header: header, body: body, count: locals.count});

        })
    })
}




//  ------------------------- Generic Functions --------------------------------------------------------------------
function setHeader(lstColumns) {
    var strHeader = '<theader>'

    var strHeader = '<theader>'

    lstColumns.forEach(function (c) {
        strHeader = strHeader + '<th>' + c + '</th>'
    })

    strHeader = strHeader + '</theader>'

    return strHeader
}

function setBody(ds) {
    var strBody = '<tbody>'


    ds.forEach(function (row) {

            if (!row.hide_input){

                strBody = strBody + '<tr><td id="firstname' + row._id +'">'+ row.firstname + '</td>' +
                    '<td id="lastname' + row._id +'">'+ row.lastname + '</td>' +
                    '<td id="role' + row._id +'">'+ row.role + '</td>' +
                    '<td id="percFullTime' + row._id +'">'+ row.percFullTime + '</td>' +
                    '<td id="edit'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="updateEmployeeField(\'' +row._id + '\',\'' + row.firstname + '\',\''+  row.lastname + '\',\'' + row.role + '\',\'' + row.percFullTime + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                    '<td id="del'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="removeEmployeeValue(\'' +row._id + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                    '</tr>'
            }
            else{
                strBody = strBody + '<tr><td id="firstname' + row._id +'">'+ row.firstname + '</td>' +
                '<td id="lastname' + row._id +'">'+ row.lastname + '</td>' +
                '<td id="role' + row._id +'">'+ row.role + '</td>' +
                '<td id="percFullTime' + row._id +'">'+ row.percFullTime + '</td></tr>'
            }
    })

    strBody = strBody + '</tbody>'
    return strBody
}