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

exports.getBlogResults = function(req, res, next) {
        console.info('------------------------- getSearchResults -------------------------')
        var lookupterm = req.body.term

        mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('blogs').find({$and: [{"titel": {$regex: ".*" + lookupterm + ".*"}}]}).toArray(function (err, content) {
                    if (err) return callback(err);
                    locals.content = content;
                    callback();
                })
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();

            var   theader = ''
                , tbody = ''
                , optionlist = ''
                , table = ''
                , columns = ['Titel','Gepubliceerd kanaal','Auteur', 'Datum publicatie']
                , body = setBody(locals.content)
                , header = setHeader(columns)

            res.status(200).json({header: header, body: body, count: locals.count});
        })
    })
}

exports.getBlogResultsForm = function(req, res, next) {
        console.info('----------- getBlogResultsForm -----------------------')

        var titel = req.body.titel
        console.info(titel)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('blogs').find({titel: titel}).toArray(function (err, blogs) {
                    if (err) return callback(err);
                    locals.blogs = blogs;
                    callback();
                });
            },
            function (callback) {
                db.collection('employees').find({}).toArray(function (err, employees) {
                    if (err) return callback(err);
                    locals.employees = employees;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            var artikel = locals.blogs[0].artikel
            console.info(artikel)
            res.status(200).json({artikel: artikel,form: addBlogForm(locals.employees, titel), message: 'succes'});
        })
    })
}


exports.getBlogText = function(req, res, next) {
    console.info('----------- getgetContentText -----------------------')

    var name = req.body.name, element = req.body.section
    console.info(name)
    console.info(element)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('content').find({"sections.element":element, "name":name},{_id: 0, sections: {$elemMatch: {element:element}}}).toArray(function (err, content) {
                    if (err) return callback(err);
                    locals.content = content;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();

            console.info(locals.content)
            var strContent = ""
            if(locals.content[0].sections[0].content){
                strContent = locals.content[0].sections[0].content
            }

            res.status(200).json({content: strContent} )});
        })
}

exports.getBlogEmployees = function(req, res, next) {
    console.info('------------------------- getBlogEmployees -------------------------')

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('employees').find({}).toArray(function (err, employees) {
                    if (err) return callback(err);
                    locals.employees = employees;
                    callback();
                })
            }
        ];
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();

            res.status(200).json({ employees: locals.employees});
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

                strBody = strBody + '<tr><td id="titel' + row._id +'">'+ row.titel + '</td>' +
                    '<td id="chanel' + row._id +'">'+ row.chanel + '</td>' +
                    '<td id="Auteur' + row._id +'">'+ row.auteur + '</td>' +
                    '<td id="CreationDate' + row._id +'">'+ moment(row.creationDate).format("DD-MM-YYYY") + '</td>' +
                    '<td id="edit'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="updateBlogField(\'' +row.titel + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                    '<td id="del'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="removeBlogValue(\'' +row._id + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                    '</tr>'
            }
            else{
                strBody = strBody + '<tr><td id="titel' + row._id +'">'+ row.titel + '</td>' +
                    '<td id="chanel' + row._id +'">'+ row.chanel + '</td>' +
                    '<td id="Auteur' + row._id +'">'+ row.auteur + '</td>' +
                    '<td id="CreationDate' + row._id +'">'+ moment(row.creationDate).format("DD-MM-YYYY") + '</td></tr>'
            }
    })

    strBody = strBody + '</tbody>'
    return strBody
}

function addBlogForm (employees, titel) {

    var chanel = '<select id="selChanel">' +
        '<option value="LinkedIn">LinkedIn</option>' +
        '<option value="Facebook">Facebook</option>' +
        '<option value="Instagram">Instagram</option>' +
        '<option value="Twitter">Twitter</option>' +
        '<option value="SQL-Central">SQL-Central</option>' +
        '</select>'

    console.info(chanel)

    var auteur = ''
    employees.forEach(function (r) {
        auteur = auteur + '<option value="'+ r.firstname  +' '+  r.lastname + '">' + r.firstname  +' '+  r.lastname + '</option>'
    })

    console.info(auteur)

    var addBlogform =
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<div class="form-group">' +
        '<label for="Titel">Titel</label>' +
        '<input type="text" class="form-control" id="txtTitel" value="'+  titel  +'" disabled="">' +
        '</div>'+
        '</div>' +
        '</div>' +
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<div class="form-group">' +
        '<label for="Publicatie kanaal">Publicatie kanaal</label>' +
        '</div>'+
        '</div>'+
        '</div>' +
        '<div class="row">'+
        '<div class="col-md-12">'+
        chanel +
        '</div>'+
        '</div>' +
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<div class="form-group">'+
        '<label for="Auteur">Auteur</label>' +
        '</div>'+
        '</div>' +
        '</div>' +
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<select id="selEmployee">' +
        auteur +
        '</select>' +
        '</div> ' +
        '</div>' +
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<div class="form-group">' +
        '<label for="Artikel">Artikel</label>' +
        '<div id="txtArtikel"></div>'+
        '<div><button class="btn btn-primary btn-flat" id="cmdAddBlog">Opslaan</button></div>' +
        '</div>' +
        '</div>' +
        '</div>'

    return addBlogform
}
