/**
 * Created by erik on 8/23/17.
 */
var multer  =   require('multer'),
    cheerio = require("cheerio"),
    fs = require('fs'),
    csv = require('fast-csv'),
    testFolder = './uploads/',
    request = require("request"),
    async = require('async'),
    mongo = require('mongodb'),
    db = require('monk')('localhost/commevents'),
    PropertiesReader = require('properties-reader'),
    br = db.get('businessrules'),
    url = 'mongodb://localhost:27017/commevents',
    sys = require('sys'),
    csvdb = db.get('csv'),
    stgOmniTracker = db.get('stgOmniTracker'),
    moment = require('moment'),
    dateCorrection = [],
    dateString = '',
    d3 = require('d3')



    businessRules = db.get('businessrules'),
    xlsxj  = require("xlsx-to-json"),
    node_xj = require("xls-to-json"),
    filename = '',
    output = ''



exports.readExceltoJSON = function (req,res,next) {
    filename = './uploads/' + req.body.selectedFiles[0]
    output = 'test.json'
    console.info(filename)

    node_xj({
        input: filename,  // input xls
        output: output, // output json
        sheet: "Incidents"  // specific sheetname
    }, function(err, result) {
        if (err) {
            console.error(err);
        } else {

            result.forEach(function (r) {
                dateString = correctionOfDate(r['Creation Date'])
                var creationDate = moment(dateString, 'DD-MM-YYYY').toDate()
                //console.info(moment())
                r['Creation Date'] = creationDate
                r.count = 1
                r.aggGrain = creationDate + '|' + r['Responsible Group'] + '|' + r.State
            })

            var resultSet = {}, aggCountsPerDayCattegory = []

            var countsPerDay = d3.nest()
                .key(function (d) {
                    return d['Creation Date']
                })
                .rollup(function (v) {
                    return {
                        count: d3.sum(v, function (d) {
                            return d.count;
                        }),
                    };
                })
                .entries(result)

            var countsPerDayCattegory = d3.nest()
                .key(function (d) {
                    return d.aggGrain
                })
                .rollup(function (v) {
                    return {
                        count: d3.sum(v, function (d) {
                            return d.count;
                        }),
                    };
                })
                .entries(result)

            console.info(countsPerDayCattegory)
            countsPerDayCattegory.forEach(function (row) {
                var key = row.key.split('|')
                var CreationDate = key[0], Group = key[1], State = key[2], count = row.values.count
                aggCountsPerDayCattegory.push({CreationDate: moment(CreationDate).toDate(), Group: Group, State: State, count: row.values.count})
            });
            console.info(aggCountsPerDayCattegory)

            stgOmniTracker.insert(result)

            res.status(201).json({countsPerDayCattegory: countsPerDayCattegory, aggCountsPerDayCattegory: aggCountsPerDayCattegory });

        }
    })
}


function correctionOfDate(inputDate){
    var dateCorrection = [], dateString = '', hourstrip = [], timeStr = '', temp = []

    dateCorrection = inputDate.split('-')
    // Days to 2 pos
    if (dateCorrection[0].length == 1){
        dateString = '0' + dateCorrection[0] + '-'
    }
    else {
        dateString = dateCorrection[0] + '-'
    }

    // Month to 2 pos
    if (dateCorrection[1].length == 1){
        dateString = dateString + '0' + dateCorrection[1] + '-'
    }
    else {
        dateString = dateString +  dateCorrection[1] + '-'
    }

    var temp = dateCorrection[2].split(' ')

    dateString = dateString + temp[0]

    // --------------------CORECTION OF HH -------------------------
    hourstrip = temp[1].split(':')
    if (hourstrip[0].trim.length == 1){
        timeStr = '0' + hourstrip[0].trim + ':'
    }
    else {
        timeStr = hourstrip[0] + ':'
    }

    // ------------------- CORECTION OF MM -------------------------
    if (hourstrip[1].trim.length == 1){
        timeStr = timeStr +  '0' + hourstrip[1].trim + ':'
    }
    else {
        timeStr = timeStr +  hourstrip[1] + ':'
    }
    // ------------------- CORECTION OF SS -------------------------
    if (hourstrip[2].trim.length == 1){
        timeStr = timeStr +  '0' + hourstrip[2].trim
    }
    else {
        timeStr = timeStr +  hourstrip[2]
    }
    return dateString
}