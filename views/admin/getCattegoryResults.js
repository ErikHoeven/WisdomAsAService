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



exports.getCattegoryResults = function(req, res, next) {
        console.info('------------------------- getSearchResults -------------------------')
        mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('businessrules').find({"typeBusinessRule": "Cattegorie"}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            },
            function (callback) {
                db.collection('businessrules').find({"typeBusinessRule": "Cattegorie"}).count({},function (err, count) {
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
                , columns = ['Categorie groepsnaam','Categorie kleur','Cattegorie waarden']
                , body = setBody(locals.businessrules)
                , header = setHeader(columns)

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

                strBody = strBody + '<tr><td id="Cattegory' + row._id +'">'+ row.tagCattegory + '</td>' +
                    '<td id="Color' + row._id +'">'+ row.cattegorycolor + '</td>' +
                    '<td id="Value' + row._id +'">'+ row.cattegoryValue + '</td>' +
                    '<td id="edit'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="updateCategoryField(\'' +row._id + '\',\'' + row.tagCattegory + '\',\''+  row.cattegorycolor +'\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                    '<td id="del'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="removeCategoryValue(\'' +row._id + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                    '</tr>'
            }
            else{
                strBody = strBody + '<tr><td id="' + row._id +'">'+ row.tagCattegory + '</td>' +
                    '<td id="' + row._id +'">'+ row.cattegorycolor + '</td>' +
                    '<td id="' + row._id +'">'+ row.cattegoryValue + '</td>' +
                    '</tr>'
            }
    })

    strBody = strBody + '</tbody>'
    return strBody
}