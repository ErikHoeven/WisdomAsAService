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



exports.getDictionaryResults = function(req, res, next) {
        console.info('------------------------- getSearchResults -------------------------')
        var lookupterm = req.body.term


        mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('corpus').find({"woord": {$regex: ".*" + lookupterm + ".*"}}).toArray(function (err, corpus) {
                    if (err) return callback(err);
                    locals.corpus = corpus;
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
                , columns = ['woord','volledigWerkwoord','werkwoordInVerledentijd','voltooiddeelwoord','typeWoord','volgLetter']
                , body = setBody(locals.corpus)
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

                strBody = strBody + '<tr><td id="woord' + row._id +'">'+ row.woord + '</td>' +
                    '<td id="volledigWerkwoord' + row._id +'">'+ row.volledigWerkwoord + '</td>' +
                    '<td id="werkwoordInVerledentijd' + row._id +'">'+ row.werkwoordInVerledentijd + '</td>' +
                    '<td id="voltooiddeelwoord' + row._id +'">'+ row.voltooiddeelwoord + '</td>' +
                    '<td id="typeWoord' + row._id +'">'+ row.typeWoord + '</td>' +
                    '<td id="volgLetter' + row._id +'">'+ row.volgLetter + '</td>' +
                    '<td id="edit'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="updateDictionaryField(\'' +row._id + '\',\'' + row.woord + '\',\''+  row.volledigWerkwoord + '\',\'' + row.werkwoordInVerledentijd + '\',\'' + row.voltooiddeelwoord + '\',\''+  row.typeWoord + '\',\'' + row.volgLetter +'\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                    '<td id="del'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="removeDictionaryValue(\'' +row._id + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                    '</tr>'
            }
            else{
                strBody = strBody + '<tr><td id="woord' + row._id +'">'+ row.woord + '</td>' +
                    '<td id="VolledigWerkwoord' + row._id +'">'+ row.volledigWerkwoord + '</td>' +
                    '<td id="werkwoordInVerledentijd' + row._id +'">'+ row.werkwoordInVerledentijd + '</td>' +
                    '<td id="voltooiddeelwoord' + row._id +'">'+ row.voltooiddeelwoord + '</td>' +
                    '<td id="typeWoord' + row._id +'">'+ row.typeWoord + '</td>' +
                    '<td id="volgLetter' + row._id +'">'+ row.volgLetter + '</td></tr>'
            }
    })

    strBody = strBody + '</tbody>'
    return strBody
}