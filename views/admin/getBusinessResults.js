/**
 * Created by erik on 12/2/17.
 */
'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb')
    //underscore = require('bower_components/underscore/underscore')



exports.getBusinesgetBusinessRulesCattegoriesRules = function(req, res, next) {
        console.info('------------------------- getBusinessRules -------------------------')
        mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = [], lookupterm = req.body.term
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('businessrules').find({tagCattegory: "Inkomstenbelasting"}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            console.info(locals.businessrules[0].cattegoryValue)

            var brCatList = locals.businessrules[0].cattegoryValue
            var optionList = '<SELECT id="selectBrCattegory">'
            brCatList.forEach(function (r) {
                optionList = optionList + '<option value="' + r + '">' + r + '</option>'
            })
            optionList = optionList + '</select>'

            var businessRuleform =
                '<div class=\"col-lg-6\">'
                + '<div class="businessrules-form">'
                + '<form>'
                + '<div class="form-group">'
                + '<div class="input-group">'
                + '<label class="col-form-label">Business Rule:</label>'
                + '</div>'
                + '<div class="input-group">'
                + '<input type="text"  id="BrName"></input>'
                + '</div>'
                + '</div>'

                + '<div class="form-group">'
                + '<div class="input-group">'
                + ' <label class="col-form-label">Business Rule Category:</label>'
                + '</div>'
                + '<div class="input-group">'
                + optionList
                + '</div>'
                + '</div>'

                + '<div class="form-group">'
                    + '<div class="input-group">'
                + '<button type="button" class="btn btn-primary" id="cmdAddExpresion">Add Expresion</button>'
                + '<button type="button" class="btn btn-primary" id="cmdSave">Save</button>'
                + '</div>'
                + '</div>'


            res.status(200).json({businessRuleform});

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
    console.info('----------- addCatValue -----------------------')

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
            console.info('============================= Cattegorie============================')
            var catValues = locals.businessrules[0].cattegoryValue

            console.info(catValues)
            res.status(200).json({catValues: catValues, message: 'succes'});
        })
    })
}



//  ------------------------- Generic Functions --------------------------------------------------------------------
function addCategoryForm (businessrules) {
    console.info('addBusinessRule')

    // A initialize variable
    var  tblBody = '<tbody>'
        ,clear = 0
        ,catValueList = businessrules[0].expressions


    //C Create form
    var masterform =
        '<div class=\"col-lg-6\">' +
        '<div class="form-group">' +
        '<label>Business Rule Name</label>' +
        '<div class="input-group">' +
        '<input type="text" class="form-control" name="brName" id="brName" value="'+ businessrules[0].businessrulename  +'">' +
        '</div>' +
        '<div class="form-group">' +
        '<\/div>' +
        '</div><div id="ExpressionsTable"></div><input type="submit" name="addExpresion" id="addExpressiom" value="Add" class="btn btn-info pull-left">'

    return {form: masterform, catValueList: catValueList}
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

                strBody = strBody + '<tr><td id="Expresson' + row._id +'">'+ row.ExpressonName + '</td>' +
                    '<td id="ExpresionVariable' + row._id +'">'+ row.ExpresionVariable + '</td>' +
                    '<td id="ExpresionVarialbeValue' + row._id +'">'+ row.ExpresionVarialbeValue + '</td>' +
                    '<td id="ExpresionOperator' + row._id +'">'+ row.ExpresionOperator + '</td>' +
                    '<td id="ExpresionPosition' + row._id +'">'+ row.ExpresionPosition + '</td>' +
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