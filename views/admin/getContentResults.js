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



exports.getContentResults = function(req, res, next) {
        console.info('------------------------- getSearchResults -------------------------')
        var lookupterm = req.body.term


        mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('content').find({$and:[{"name": {$regex: ".*" + lookupterm + ".*"}}]}).toArray(function (err, content) {
                    if (err) return callback(err);
                    locals.content = content;
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
                , columns = ['Pagina naam','url','secties']
                , body = setBody(locals.content)
                , header = setHeader(columns)

            console.info(body)

            res.status(200).json({header: header, body: body, count: locals.count});

        })
    })
}

exports.getContentResultsForm = function(req, res, next) {
        console.info('----------- getContentResultsForm -----------------------')

        var name = req.body.name
        console.info(name)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('content').find({name: name}).toArray(function (err, content) {
                    if (err) return callback(err);
                    locals.content = content;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            var sections = locals.content[0].sections
            var name = locals.content[0].name
            var url = locals.content[0].url
            var content = locals.content[0].sections[0].content

            console.info(url)
            res.status(200).json({form: setContentForm(sections, name, url), content: content, message: 'succes'});
        })
    })
}


exports.getContentText = function(req, res, next) {
    console.info('----------- getContentText -----------------------')

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

exports.getSectionsContent = function(req, res, next) {
    console.info('----------- getSectionsContent -----------------------')

    var name = req.body.name
    console.info(name)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('content').find({ name:name}).toArray(function (err, content) {
                    if (err) return callback(err);
                    locals.content = content;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();


            var content = locals.content[0].sections
            res.status(200).json({content: content} )});
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

                strBody = strBody + '<tr><td id="name' + row._id +'">'+ row.name + '</td>' +
                    '<td id="url' + row._id +'">'+ row.url + '</td>' +
                    '<td id="sections' + row._id +'">'+ row.sections + '</td>' +
                    '<td id="edit'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="updateContentField(\'' +row.name + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                    '<td id="del'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="removeContentValue(\'' +row._id + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                    '</tr>'
            }
            else{
                strBody = strBody + '<tr><td id="name' + row._id +'">'+ row.name + '</td>' +
                    '<td id="url' + row._id +'">'+ row.url + '</td>' +
                    '<td id="sections' + row._id +'">'+ row.sections + '</td></tr>'
            }
    })

    strBody = strBody + '</tbody>'
    return strBody
}

function setContentForm(sections,name, url) {
    var strOptions = '<select id="selSection">'
    sections.forEach(function (r) {
          strOptions = strOptions + '<option value="'+ r.element +'">'+r.element  +'</option>'
    })
    strOptions = strOptions + '</select>'

   var strForm = '<div class="row">'+
    '<div class="col-md-12">'+
    '<div class="c_panel">' +
    '<div class="clearfix"></div>' +
    '</div><!--/.c_title-->' +
    '<div class="c_content">' +
    '<div class="form-group">' +
    '<label for="page">Pagina naam</label>' +
    '<input type="text" class="form-control" id="txtPageName" placeholder="'+ name + '" disabled value="'+ name +'">' +
    '</div>'+
    '<div class="form-group">' +
    '<label for="URL">URL</label>' +
    '<input type="text" class="form-control" id="txtURL" placeholder="'+ url + '" disabled  value="'+ url +'">' +
    '</div>'+
    '<div class="form-group">'+
    '<label for="Section">Section:</label>' +
    strOptions +
    '</div> ' +
    '<div class="form-group">' +
    '<label for="content">content</label>' +
    '<textarea id="txtContent"></textarea>' +
    '</div>'+
    '<div>' +
    '<button class="btn btn-primary btn-flat" id="cmdSaveContent">Opslaan</button>' +
    '</div>' +
    '</div>' +
    '</div>'
    '</div>'
    '</div>'


return strForm
}

