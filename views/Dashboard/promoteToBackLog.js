/**
 * Created by erik on 12/2/17.
 */
'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    backlog = db.get('backlog'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')


exports.promoteToBackLog = function (req, res, next) {
        var arrBackLog = [], dataset = req.body.dataset

        dataset.forEach(function (row) {
            arrBackLog.push({Number: row.Number
                            ,Title: row['Title']
                           ,'Nr Of Open Calendar Days': row["Nr Of Open Calendar Days"]|| Math.abs(moment().toDate() - moment(row['Creation Date']).toDate()) / 36e5  })
        })
        console.info(arrBackLog)

        arrBackLog = underscore. _.uniq(arrBackLog, function(x){
            return x.Number;
        });
        backlog.insert(arrBackLog)
        res.status(200).json({message: 'User Stories to planning'})
}


exports.getBackLogList = function (req,res,next) {
    var theader = ''
        , tbody = ''
        , optionlist = ''
        , table = ''
        , backlogColumns = ['Number', 'Title', 'Open Days', 'StoryPoints', 'Sprint', 'Developer']
        , devColumns = ['Developer', 'percentage available', 'Affective Story points', 'StoryPoints left']
        , sprints = ['01 - 02 : 2018', '03 - 04 : 2018', '05 - 06 : 2018', '07 - 08 : 2018', '09 -10 : 2018']
        , developers = []

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('backlog').find({}).toArray(function (err, backlog) {
                    if (err) return callback(err);
                    locals.backlog = backlog;
                    callback();
                });
            },
            function (callback) {
                db.collection('businessrules').find({"typeBusinessRule" : "maintenanceAssignment"}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }
        ];


        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();

            locals.businessrules.forEach(function (dev) {
                developers.push(dev.developer)
            })


            var   backlogBody = setBody(locals.backlog, sprints, developers)
                , backlogHeader = setHeader(backlogColumns)
                , devHeader = setHeader(devColumns)
                , devBody = setBody(locals.businessrules)





            res.status(200).json({backlogBody: backlogBody, backlogHeader: backlogHeader, devHeader: devHeader, devBody: devBody,  message: 'Succesful '})


        })
    })
}

exports.updateBacklog = function (req,res,next) {
    var theader = ''
        , tbody = ''
        , optionlist = ''
        , table = ''
        , collection = 'backlog'
        , backlogColumns = ['Number', 'Title', 'Open Days', 'StoryPoints', 'Sprint', 'Developer']
        , devColumns = ['Developer', 'percentage available', 'Affective Story points', 'StoryPoints left']
        , sprints = ['01 - 02 : 2018', '03 - 04 : 2018', '05 - 06 : 2018', '07 - 08 : 2018', '09 -10 : 2018']
        , updateFields = req.body.updateFields
        , connection = db.get(collection)
        , updateObject = {developer: updateFields.developer ,storypoints: updateFields.storyPoints, sprints: updateFields.sprints, hide_save: 'yes' , hide_input: 'yes'}
        , developers = []


        console.info(updateFields)

        connection.update({Number: updateFields.id}, {$set: updateObject}, false, true)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('backlog').find({}).toArray(function (err, backlog) {
                    if (err) return callback(err);
                    locals.backlog = backlog;
                    callback();
                });
            },
            function (callback) {
                db.collection('businessrules').find({"typeBusinessRule" : "maintenanceAssignment"}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }
        ];
        //console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();

            locals.businessrules.forEach(function (dev) {
                developers.push(dev.developer)
            })

            var   backlogBody = setBody(locals.backlog, sprints, developers)
                , backlogHeader = setHeader(backlogColumns)
                , devHeader = setHeader(devColumns)
                , devBody = setBody(locals.businessrules)

            res.status(200).json({backlogBody: backlogBody
                                , backlogHeader: backlogHeader
                                , devHeader: devHeader
                                , devBody: devBody
                                , message: 'Succesful'
                                , developer: updateFields.developer
                                , storypoints: updateFields.storyPoints})


        })
    })
}
exports.clearBacklog = function (req, res, next) {
    backlog.remove({})
    res.status(200).json({message: 'Succesful '})

}

exports.exportBacklogToPowerpoint = function (req, res, next) {
    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [   // Load backlog
            function (callback) {
                db.collection('backlog').find({}).toArray(function (err, backlog) {
                    if (err) return callback(err);
                    locals.backlog = backlog;
                    callback();
                });
            }
        ];
        //console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();

            res.status(200).json({message: 'Succesful', dataset: locals.backlog})
        })
    })
}


//  ------------------------- Generic Functions --------------------------------------------------------------------
function setHeader(lstColumns) {
    var strHeader = '<theader>'

    lstColumns.forEach(function (c) {
        strHeader = strHeader + '<th>' + c + '</th>'
    })

    strHeader = strHeader + '</theader>'

    return strHeader
}


function setOptionList(list, id, title) {
    var strOptionList = '<select class="selectpicker" id="'+ title +  id +'">'

        list.forEach(function (item) {
            strOptionList = strOptionList + '<option>' + item  + '</option>'
        })
        strOptionList = strOptionList + '</select>'

    return strOptionList
}

function setBody(ds,optionlist1, optionlist2, dev, points) {
        var strBody = '<tbody>', StoryPoints = []


    ds.forEach(function (row) {

        //Check if it is a Backlog dataset
        if (row.Number){
            if (!row.hide_input){
                var option1 = '', option2 = ''
                option1 = setOptionList(optionlist1,row.Number, 'sprint')
                option2 = setOptionList(optionlist2,row.Number, 'developer')


                strBody = strBody + '<tr><td>'+ row.Number + '</td>' +
                                        '<td>'+ row.Title +'</td>' +
                                        '<td>'+ row['Nr Of Open Calendar Days'] +'</td>' +
                                        '<td><input type="text" id="txtStoryPoints'+ row.Number +'"></input></td>' +
                                        '<td>'+ option1 +'</td>' +
                                        '<td>'+ option2 +'</td>' +
                                        '<td><button type="button" class="btn btn-default btn-sm" onclick="updateBackLog(\'' + row.Number + '\')"><span class="glyphicon glyphicon-ok"></span>Ok</button></td>' +
                    '</tr>'
            }
            else{
                strBody = strBody + '<tr><td>'+ row.Number + '</td>' +
                                        '<td>'+ row.Title +'</td>' +
                                        '<td>'+ row['Nr Of Open Calendar Days'] +'</td>' +
                                        '<td>'+ row.storypoints +'</td>' +
                                        '<td>'+ row.sprints +'</td>' +
                                        '<td>'+ row.developer +'</td>' +
                                        '</tr>'

                if(StoryPoints.length == 0){
                    StoryPoints.push({developer: row.developer, storyPoints: row.storypoints })
                }
                else {
                    StoryPoints.forEach(function (sp) {
                        if(sp.developer == row.developer){
                            sp.storypoints = sp.storypoints + row.storypoints
                        }
                        else{
                           StoryPoints.push({developer: row.developer, storyPoints: row.storypoints })
                        }
                    })
                }

            }
        }
        else{
            var dev = row.developer.split(' ')


                strBody = strBody + '<tr><td>'+ row.developer + '</td>' +
                    '<td>'+ row.percentage +'</td>' +
                    '<td>'+ 30 / 100 * row.percentage +'</td>' +
                    '<td id="'+ dev[0]+ '">'+ 30 / 100 * row.percentage +'</td>' +
                    '</tr>'

        }
    })

    strBody = strBody + '</tbody>'
    return strBody
}



