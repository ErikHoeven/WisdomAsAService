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
        console.info('------------------------- getCattegoryResults -------------------------')
        mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = [], lookupterm = req.body.term
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('businessrules').find({$and: [{"tagCattegory": {$regex: ".*" + lookupterm + ".*"}}]}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
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

            res.status(200).json({header: header, body: body});

        })
    })
}

exports.getCategoryResultsForm = function(req, res, next) {
    console.info('----------- getBlogResultsForm -----------------------')

    var tagCattegory = req.body.tagCattegory
    console.info(tagCattegory)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('businessrules').find({tagCattegory: tagCattegory}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            res.status(200).json({form: addCategoryForm(locals.businessrules), message: 'succes'});
        })
    })
}


exports.addCatValue = function(req, res, next) {
    console.info('----------- getBlogResultsForm -----------------------')

    var tagCattegory = req.body.tagCattegory
    console.info(tagCattegory)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('businessrules').find({tagCattegory: tagCattegory}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            var catValues = locals.businessrules[0].cattegoryValue

            res.status(200).json({catValues: catValues, message: 'succes'});
        })
    })
}



//  ------------------------- Generic Functions --------------------------------------------------------------------
function addCategoryForm (businessrules) {
    console.info('addCategoryForm')

    // A initialize variable
    var  tblBody = '<tbody>'
        ,clear = 0
        ,catValueList = businessrules[0].cattegoryValue


    //C Create form
    var catform =
        '<div class=\"col-lg-6\">' +
        '<div class="form-group">' +
        '<label>Categorie</label>' +
        '<div class="input-group">' +
        '<input type="text" class="form-control" name="Categorie" id="Categorie" value="'+ businessrules[0].tagCattegory  +'">' +
        '</div>' +
        '<div class="form-group">' +
        '<\/div>' +
        '<div class="form-group"><label>Kleur</label>' +
        '<div class="input-group"><input type="text" name="txtkleur" id="txtKleur" class="pick-a-color form-control" value="'+ businessrules[0].cattegorycolor  +'">' +
        '</div><div id="CatValueTable"></div><input type="submit" name="addCattegory" id="addCattegory" value="Toevoegen" class="btn btn-info pull-left">'

    return {form: catform, catValueList: catValueList}
}

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
                    '<td id="edit'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="updateCategoryField(\'' + row.tagCattegory + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
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