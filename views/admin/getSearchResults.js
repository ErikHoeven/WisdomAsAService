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



exports.getSearchResults = function(req, res, next) {
        console.info('------------------------- getSearchResults -------------------------')
        mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('businessrules').find({"typeBusinessRule": "Zoekwaarde"}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            },
            function (callback) {
                db.collection('businessrules').find({"typeBusinessRule": "Zoekwaarde"}).count({},function (err, count) {
                    if (err) return callback(err);
                    locals.count = count;
                    callback();
                });
            }

        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info(locals.businessrules)

            var   theader = ''
                , tbody = ''
                , optionlist = ''
                , table = ''
                , columns = 'lookupValue'
                , body = setBody(locals.businessrules)
                , header = setHeader(columns)

            res.status(200).json({header: header, body: body, count: locals.count});

        })
    })
}




//  ------------------------- Generic Functions --------------------------------------------------------------------
function setHeader(lstColumns) {
    var strHeader = '<theader>'

           strHeader = strHeader + '<th>' + lstColumns + '</th>'


    strHeader = strHeader + '</theader>'

    return strHeader
}

function setBody(ds) {
    var strBody = '<tbody>'


    ds.forEach(function (row) {

            if (!row.hide_input){

                strBody = strBody + '<tr><td id="' + row._id +'">'+ row.lookupValue + '</td>' +
                    '<td id="cmd'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="updateField(\'' +row._id + '\',\'' + row.lookupValue + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
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