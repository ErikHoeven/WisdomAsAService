var async = require('async'),
    db = require('monk')('localhost/commevents'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    _ = require('underscore')


exports.zoekenScenario = function(req, res, next) {
    console.info('------------------------- zoekenScenario -------------------------')
    var Scenario = req.body.Scenario
    console.info(Scenario)

    if(Scenario) {
        mongo.connect(uri, function (err, db) {
            var locals = {}, tokens = []
            var tasks = [
                function (callback) {
                    db.collection('inkomstenbelasting').find({"ScenarioName": {$regex: ".*" + Scenario + ".*"}}).toArray(function (err, businessrules) {
                        if (err) return callback(err);
                        locals.businessrules = businessrules;
                        callback();
                    });
                }
            ];

            async.parallel(tasks, function (err) {
                if (err) return next(err);
                db.close();
                console.info('DB RESULT:')
                console.info(locals.businessrules)

                if(locals.businessrules.length > 0) {
                    var theader = ''
                        , tbody = ''
                        , optionlist = ''
                        , table = ''
                        , columns = ['ScenarioName','OnderdeelPositie']
                        , body = setBody(locals.businessrules)
                        , header = setHeader(columns)

                    res.status(200).json({header: header, body: body, count: locals.count});
                }
                else {
                    res.status(200).json({message: 'No data found'});
                }

            })
        })
    }
    else {
        res.status(200).json({message: 'No data found'});
    }
}




function setBody(ds) {
    var strBody = '<tbody>'


    ds.forEach(function (row) {
        console.info('--------')
        console.info(row)
        console.info('--------')


        if (!row.hide_input){
            console.info('!row.hide_input')
            strBody = strBody + '<tr><td id="ScenarioName' + row._id +'">'+ row.ScenarioName + '</td>' +
                '<td id="OnderdeelPositie' + row._id +'">'+ row.OnderdeelPositie + '</td>' +
                '<td id="edit'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="updateScenario(\'' +row.ScenarioName + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                '<td id="del'+ row._id + '"><button type="button" class="btn btn-default btn-sm" onclick="removeScenario(\'' +row._id + '\')"><span id="span"'+ row._id +' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                '</tr>'
        }
        else{
            console.info('row.hide_input')
            strBody = strBody + '<tr><td id="ScenarioName' + row._id +'">'+ row.ScenarioName + '</td>' +
                '<td id="OndeOnderdeelPositierdeelPositie' + row._id +'">'+ row.OnderdeelPositie + '</td></tr>'
        }
    })

    strBody = strBody + '</tbody>'
    return strBody
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