/**
 * Created by erik on 8/23/17.
 */
var async = require('async'),
    db = require('monk')('localhost/commevents'),
    stgOmniTracker = db.get('stgOmniTracker'),
    moment = require('moment'),
    node_xj = require("xls-to-json"),
    dateCorrection = [],
    dateString = '',
    d3 = require('d3'),
    filename = '',
    output = '',
    snapshot = '',
    snapshotDate = ''


exports.readExceltoJSON = function (req,res,next) {
     filename = './uploads/' + req.body.selectedFiles[0]
     snapshot = moment(req.body.uploadDate,'MM/DD/YYYY').format('DD-MM-YYYY')
     snapshotDate = moment(snapshot,'DD-MM-YYYY').toDate()
     output = 'test.json'
     filesplit = filename.split('.')

    if (filesplit[2] == 'xls') {
        console.info('xls')
        //test
        node_xj({
            input: filename,  // input xls
            output: output, // output json
            sheet: "Export0"  // specific sheetname
        }, function (err, result) {
            if (err) {
                console.info('error')
                console.error(err);
            } else {
                result.forEach(function (r) {

                    dateString = correctionOfDate(r['Creation Date'])
                    // Check DD-MM-YYYY
                    checkDate = dateString.split('-')

                    if (parseInt(checkDate[0]) <= 31 && parseInt(checkDate[1]) <= 12 && parseInt(checkDate[1]) <= moment().month() + 1) {
                        var creationDate = moment(dateString, 'DD-MM-YYYY').toDate(), ticketType = ''
                        if(r['Last Change']){
                            dateString = correctionOfDate(r['Last Change'])
                            var lastChange = moment(dateString, 'DD-MM-YYYY').toDate()
                        }

                    }
                    else {
                        var creationDate = moment(dateString, 'DD-MM-YYYY').toDate(), ticketType = ''
                        dateString = correctionOfDate(r['Last Change'])
                        var lastChange = moment(dateString, 'DD-MM-YYYY').toDate()

                    }

                    // Ticket Type
                    if (r.Number.substring(0, 3) == 'INC') {
                        ticketType = 'Incident'
                    }
                    if (r.Number.substring(0, 3) == 'SRQ') {
                        ticketType = 'Service Request'
                    }
                    if (r.Number.substring(0, 3) == 'RFC') {
                        ticketType = 'Change'
                    }


                    r['Creation Date'] = creationDate
                    r.count = 1
                    var groupCount = r['Responsible Group'] + '_Count'
                    r[groupCount] = 1
                    r.ticketType = ticketType
                    r.snapshotDate = snapshotDate
                    r.lastChange = lastChange
                    r.aggGrain = creationDate + '|' + r['Responsible Group'] + '|' + r.State + '|' + snapshotDate + '|' + ticketType + '|' + lastChange + '|' + r['Affected Person']

                })

                //stgOmniTracker.remove({})
                stgOmniTracker.insert(result)
                res.status(201).json({message: 'Succesfull uploaded'});

            }
        })
    }
    if (filesplit[2] == 'xlsx') {
        console.info('xlsx')
        console.info(filename)
        stgOmniTracker.remove({})

        var XLSX = require('xlsx');
        var workbook = XLSX.readFile(filename);
        var sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function(y) {
            var worksheet = workbook.Sheets[y];
            var headers = {};
            var data = [];
            for (z in worksheet) {
                if(z[0] === '!') continue;
                var tt = 0;

                for (var i = 0; i < z.length; i++) {
                    if (!isNaN(z[i])) {
                        tt = i;
                        break;
                    }
                };
                var col = z.substring(0,tt);
                var row = parseInt(z.substring(tt));
                var value = worksheet[z].v;

                //store header names
                if(row == 1 && value) {
                    headers[col] = value;
                    continue;
                }

                if(!data[row]) data[row]={};
                data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();

                insertSTGOmniTracker(data)
                //console.info(data.length)
                res.status(201).json({message: 'Succesfull uploaded'});

        });
    }
}

function correctionOfDate(inputDate){
    var dateCorrection = []
       ,dateString = ''
       , hourstrip = []
       , timeStr = ''
       , temp = []


        //Check if date is completed with 2 digets for days and months
         if (inputDate.indexOf('-') >= 0  && inputDate.indexOf('-') < 3){
            dateCorrection = inputDate.split('-')
            //timeStr = dateCorrection[1]
         }
         else{
           //console.info('date seperator = /')
           dateCorrection = inputDate.split('/')
           timeStr = dateCorrection[1]
         }

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

           //console.info(dateCorrection[2])

            //console.info(dateCorrection[2])
            if(dateCorrection[2].indexOf('-') == 4){
                var temp = dateCorrection[2].split('-')
            }
            else{
                var temp = dateCorrection[2].split(' ')
            }
            //console.info(temp)



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




function dateStringtoDate(dateString) {

    var returnDate

    if (dateString.indexOf('-') > 0){
        checkDate = dateString.split('-')

        if (parseInt(checkDate[0]) <= 31
            && parseInt(checkDate[1]) <= 12
            && ( parseInt(checkDate[1]) <= moment().month() + 1
               || parseInt(checkDate[1]) > moment().month() + 1
                  && parseInt(checkDate[2]) < moment().year())
        ) {
            returnDate = moment(dateString, 'DD-MM-YYYY').toDate()
        }
        else {
            returnDate = moment(dateString, 'MM-DD-YYYY').toDate(), ticketType = ''
        }
    }
    else{

        checkDate = dateString.split('/')

        if (parseInt(checkDate[0]) <= 31 && parseInt(checkDate[1]) <= 12 && parseInt(checkDate[1]) <= moment().month() + 1) {
            returnDate = moment(dateString, 'DD-MM-YYYY').toDate()
        }
        else {
            returnDate = moment(dateString, 'MM-DD-YYYY').toDate(), ticketType = ''
        }
    }
    return returnDate
}

function insertSTGOmniTracker(data){


    console.info('---- START FUNCTION ---')
    var cleanData = []
    //Clean Data
    for (i = 2; i < data.length; i++){
        if (data[i] != 'undefined '){
            cleanData.push(data[i])
        }
    }

    //EnrichData
    console.info('Length Clean Data')
    console.info(cleanData.length)
    if(cleanData.length > 0){
        cleanData.forEach(function (r) {
            //console.info(r.length)

            if(r) {

                //var input = '01/01/1997'- Creation Date
                if (r['Creation Date']) {
                    dateString = correctionOfDate(r['Creation Date'])
                    creationDate = dateStringtoDate(dateString)
                }
                else{
                    creationDate = ''
                }


                if(r['Last Change']){
                    dateString = correctionOfDate(r['Last Change'])
                    lastChange = dateStringtoDate(dateString)
                }
                else{
                    lastChange = ''
                }


                if (r['Solved Date']) {
                    if (r['Solved Date'].length == 19) {
                        dateString = correctionOfDate(r['Solved Date'])
                        solvedDate = dateStringtoDate(dateString)
                    }
                    else {
                        r.SolvedDate = ''
                    }

                }
                else {
                    r.SolvedDate = ''
                }

                if (r['Closed Date']) {
                    if (r['Closed Date'].length == 19) {
                        dateString = correctionOfDate(r['Closed Date'])
                        closedDate = dateStringtoDate(dateString)
                    }
                    else {
                        r.closedDate = ''
                    }

                }
                else {
                    r.closedDate = ''
                }


                //datumFormat =  dateStringtoDate(dateString)
                //r['Creation Date'] = datumFormat

                // Ticket Type
                if (r.Number.substring(0, 3) == 'INC') {
                    ticketType = 'Incident'
                }
                if (r.Number.substring(0, 3) == 'SRQ') {
                    ticketType = 'Service Request'
                }
                if (r.Number.substring(0, 3) == 'RFC') {
                    ticketType = 'Change'
                }

                //r['Creation Date'] = creationDate
                r.count = 1
                var groupCount = r['Responsible Group'] + '_Count'
                r[groupCount] = 1
                r.ticketType = ticketType
                r.snapshotDate = snapshotDate
                r.lastChange = lastChange
                r.lastChangeYear = moment(lastChange).year()
                r.lastChangeWeek = moment(lastChange).week()
                r.creationDate = creationDate
                r.creationYear = moment(creationDate).year()
                r.creationWeek = moment(creationDate).week()
                r.solvedDate = solvedDate
                r.aggGrain = creationDate + '|' + r['Responsible Group'] + '|' + r.State + '|' + snapshotDate + '|' + ticketType + '|' + lastChange + '|' + r['Affected Person']


                stgOmniTracker.insert(r)
            }
        })
    }
console.info('---- END FUNCTION ---')
}