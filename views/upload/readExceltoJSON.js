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
    output = ''
   ,snapshot = moment('20-10-2017','DD-MM-YYYY').format('DD-MM-YYYY')
   ,snapshotDate = moment(snapshot,'DD-MM-YYYY').toDate()



exports.readExceltoJSON = function (req,res,next) {
    filename = './uploads/' + req.body.selectedFiles[0]
    output = 'test.json'
    filesplit = filename.split('.')

    if (filesplit[2] == 'xls') {
        console.info('xls')
        node_xj({
            input: filename,  // input xls
            output: output, // output json
            sheet: "Export0"  // specific sheetname
        }, function (err, result) {
            if (err) {
                console.error(err);
            } else {
                result.forEach(function (r) {

                    //var input = '01/01/1997';
                    dateString = correctionOfDate(r['Creation Date'])


                    // Check DD-MM-YYYY
                    checkDate = dateString.split('-')

                    if (parseInt(checkDate[0]) <= 31 && parseInt(checkDate[1]) <= 12 && parseInt(checkDate[1]) <= moment().month() + 1) {
                        var creationDate = moment(dateString, 'DD-MM-YYYY').toDate(), ticketType = ''
                        //console.info(r.Number + ' : ' + dateString )
                        //console.info(creationDate)
                        dateString = correctionOfDate(r['Last Change'])
                        var lastChange = moment(dateString, 'DD-MM-YYYY').toDate()
                    }
                    else {
                        var creationDate = moment(dateString, 'MM-DD-YYYY').toDate(), ticketType = ''
                        dateString = correctionOfDate(r['Last Change'])
                        var lastChange = moment(dateString, 'MM-DD-YYYY').toDate()

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


        var XLSX = require('xlsx');
        var workbook = XLSX.readFile(filename);
        var sheet_name_list = workbook.SheetNames;
        var cleanData = []
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
                if(row == 4 && value) {
                    headers[col] = value;
                    continue;
                }

                if(!data[row]) data[row]={};
                data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();

            //Clean Data
            for (i = 3; i < data.length; i++){
                if (data[i] != 'undefined '){
                    cleanData.push(data[i])
                }
            }

            //EnrichData
            cleanData.forEach(function (r) {

                console.info('CleanData: ' + r['Number'] )
                var datumFormat
                //var input = '01/01/1997'- Creation Date
                dateString = correctionOfDate(r['Creation Date'])
                creationDate = dateStringtoDate(dateString)
                console.info('CreationDate:' + r['Number'] + '  | '  + dateString )
                console.info(creationDate)

                dateString = correctionOfDate(r['Last Change'])
                lastChange = dateStringtoDate(dateString)
                console.info('lastChange:' + r['Number'] + '  | '  + dateString )
                console.info(lastChange)

                if(r['Solved Date'] ){
                    if (r['Solved Date'].length == 19){
                        console.info('solvedDate:' + r['Number'])
                        dateString = correctionOfDate(r['Solved Date'])
                        solvedDate = dateStringtoDate(dateString)
                        console.info(solvedDate)
                        r.SolvedDate = solvedDate
                    }
                    else {
                        r.SolvedDate = ''
                    }

                }
                else {
                    r.SolvedDate = ''
                }

                if(r['Closed Date']) {
                    if(r['Closed Date'].length == 19){
                        console.info('closedDate:' + r['Number'] )
                        console.info(r['Closed Date'].length)
                        dateString = correctionOfDate(r['Closed Date'])
                        closedDate = dateStringtoDate(dateString)
                        console.info(closedDate)
                        r.closedDate = closedDate
                    }
                    else{
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

                r['Creation Date'] = creationDate
                r.count = 1
                var groupCount = r['Responsible Group'] + '_Count'
                r[groupCount] = 1
                r.ticketType = ticketType
                r.snapshotDate = snapshotDate
                r.lastChange = lastChange
                r.aggGrain = creationDate + '|' + r['Responsible Group'] + '|' + r.State + '|' + snapshotDate + '|' + ticketType + '|' + lastChange + '|' + r['Affected Person']


                stgOmniTracker.insert(r)
            })

            console.info(data.length)
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
    if (inputDate.indexOf('-') >= 3 ){
        dateCorrection = inputDate.split('-')
        dateString = dateCorrection[0]
        timeStr = dateCorrection[1]
   }

    //If not completed completed with a zero before all single digets (days and months )
   else{
       if (inputDate.indexOf('-') >= 0  && inputDate.indexOf('-') < 3){
            dateCorrection = inputDate.split('-')
       }
       else{
           //console.info('date seperator = /')
           dateCorrection = inputDate.split('/')
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
   }

    return dateString
}


function dateStringtoDate(dateString) {

    var returnDate

    if (dateString.indexOf('-') > 0){
        checkDate = dateString.split('-')

        if (parseInt(checkDate[0]) <= 31 && parseInt(checkDate[1]) <= 12 && parseInt(checkDate[1]) <= moment().month() + 1) {
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
