/**
 * Created by erik on 8/23/17.
 */
var async = require('async'),
    db = require('monk')('localhost/commevents'),
    stgOmniTracker = db.get('stgOmniTracker'),
    moment = require('moment'),
    xlsxj  = require("xlsx-to-json"),
    node_xj = require("xls-to-json"),
    dateCorrection = [],
    dateString = '',
    d3 = require('d3'),
    filename = '',
    output = ''
   ,snapshot = moment().format('DD-MM-YYYY')
   ,snapshotDate = moment(snapshot,'DD-MM-YYYY').toDate()

exports.readExceltoJSON = function (req,res,next) {
    filename = './uploads/' + req.body.selectedFiles[0]
    output = 'test.json'
    console.info(filename)

    node_xj({
        input: filename,  // input xls
        output: output, // output json
        sheet: "Export0"  // specific sheetname
    }, function(err, result) {
        if (err) {
            console.error(err);
        } else {




            result.forEach(function (r) {
                dateString = correctionOfDate(r['Creation Date'])
                var creationDate = moment(dateString, 'DD-MM-YYYY').toDate(), ticketType = ''
                dateString = correctionOfDate(r['Last Change'])
                var lastChange = moment(dateString, 'DD-MM-YYYY').toDate()

                // Ticket Type
                if (r.Number.substring(0,3) == 'INC'){
                    ticketType = 'Incident'
                }
                if (r.Number.substring(0,3) == 'SRQ'){
                    ticketType = 'Service Request'
                }
                if (r.Number.substring(0,3) == 'RFC'){
                    ticketType = 'Change'
                }


                r['Creation Date'] = creationDate
                r.count = 1
                var groupCount = r['Responsible Group'] + '_Count'
                r[groupCount] = 1
                r.ticketType = ticketType
                r.snapshotDate = snapshotDate
                r.lastChange = lastChange
                r.aggGrain = creationDate + '|' + r['Responsible Group'] + '|' + r.State + '|' +  snapshotDate + '|' + ticketType + '|' +lastChange
            })

            //stgOmniTracker.remove({})
            stgOmniTracker.insert(result)

            res.status(201).json({message: 'Succesfull uploaded' });

        }
    })
}


function correctionOfDate(inputDate){
    var dateCorrection = [], dateString = '', hourstrip = [], timeStr = '', temp = []
    console.info('inputDate')
    console.info(inputDate)
    dateCorrection = inputDate.split('/')
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