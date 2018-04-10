/**
 * Created by erik on 4/9/18.
 */

'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')


exports.getCVS = function(req, res, next) {
    console.info('------------------------- getSearchResults -------------------------')
    var lookupterm = req.body.term

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('CV').find({$or:[{"voornaam": {$regex: ".*" + lookupterm + ".*"}},{"achternaam": {$regex: ".*" + lookupterm + ".*"}}]}).toArray(function (err, cvs) {
                    if (err) return callback(err);
                    locals.cvs = cvs;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info(locals.cvs)

            var   theader = ''
                , tbody = ''
                , optionlist = ''
                , table = ''
                , columns = ['voornaam','achternaam','titel']
                , body = setBody(locals.cvs)
                , header = setHeader(columns)

            res.status(200).json({header: header, body: body});



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

            strBody = strBody + '<tr><td id="' + row._id +'">'+ row.voornaam + '</td>' +
                '<td id="' + row._id +'">'+ row.achternaam + '</td>' +
                '<td id="' + row._id +'">'+ row.titel + '</td>' +
                '<td id="cmd'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="updateField(\'' +row._id + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                '<td id="del'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="removeValue(\'' +row._id + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                '</tr>'
        }
        else{
            strBody = strBody + '<tr><td>'+ row.lookupValue + '</td>' +
                '</tr>'
        }
    })

    strBody = strBody + '</tbody>'
    return strBody
}