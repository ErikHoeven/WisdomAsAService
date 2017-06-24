/**
 * Created by erik on 6/4/17.
 */
var cheerio = require("cheerio")
    ,request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,db = require('monk')('localhost/commevents')
    ,dbm = require('mongodb').MongoClient
    ,companies =  db.get('companyresults')
    ,corpus = db.get('corpus')
    ,url = db.get('url')
    ,d3 = require('d3')
    ,score = db.get('businessrules')
    ,tmp = db.get('tmp')
    ,uri = 'mongodb://localhost:27017/commevents'
    ,tableDefinition = {}



exports.createGenericTable = function (req, res, next) {
        console.info('start createGenericTable')
        tableDefinition = req.body.tableDefinition
        var pagnationStep = req.body.setPagnationStep, setActualStep = req.body.setActualStep



    mongo.connect(uri, function (err, db) {
        console.info('MONGODB START CHECK COLLECTIONS')
        var locals = {}, tasks = [
            // Load tmp
            function (callback) {
                db.collection('businessrules').find({}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                })
            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            var businessrules = []
            db.close()
            businessrules = locals.businessrules

            //console.info(businessrules)
             var tableResult = genericTable(businessrules, tableDefinition, pagnationStep, setActualStep)
             var pagingResultSet = setPagnation(businessrules, pagnationStep,setActualStep)
             res.status(200).json({tableResult: tableResult, pagingResultSet: pagingResultSet })

        })
    })

}

/**
 * Created by erik on 3/19/17.
 * Parameter 0 data multidimensional array
 * Parameter 1 tabledefinition contains an object of a tabledefinition and contains the following properties:
 * { tableName: [tablename],
 *   divTable:  [divTable],
 *   tableTitle: [tableTitle]
 *   keyColumn: [KeyColumn of the data parameter] var,
 *   hideColumns: [array of columns to hide],
 *   filterConditions:  [filterData on the following conditions {[columnName : [columnValue]]},
 *   pagnation: { rows: show xxx rows on the page
 *               ,start: shows row to start},
 *   deleteRow: option to delete row in dataSet[Y,N],
 *   editRow  : option to edit fields in dataset[Y,N]}
 *
 *
 *
 *
 */
function genericTable (data, tableDefinition, pagnationStep, actualStep ){

    var   columns = []
        , strColumns = ''
        , i = 0
        , strData = ''
        , keys= []
        , colpos = []
        , lastPos = -1
        , countColss
        , rowNumber = 0
        , updateAftrek = 0
        , hideColumnHit = 0
        , columnValue = ''
        , totHideCols = tableDefinition.keyColumn.concat(tableDefinition.hideColumns)
        , sourceCollection = tableDefinition.sourceCollection
        , ddl = []
        , colHit = 0
        , output = {}
        , startingStepRow
        , lastStepRow


    columns =  Object.keys(data[0])
    console.info('--------------------------------------------------------------------')
    console.info('titel: ' + tableDefinition.title)
    console.info('KeyColumn: ' + tableDefinition.keyColumn)
    console.info('hideColls:' + totHideCols )
    console.info('cols: ' +  columns)
    console.info('totHideCols: ' +  totHideCols.length)
    console.info('div place: ' + tableDefinition.divTable )
    console.info('div name: ' + tableDefinition.tableName)
    console.info('pagnationStep: ' + pagnationStep  )
    console.info('actualStep: ' + actualStep)
    console.info('datalength: ' + data.length )
    updateAftrek = totHideCols.length
    var pagnationSteps =  data.length/  pagnationStep
    console.info(columns )
    console.info(sourceCollection)
    if (actualStep == 1){
        startingStepRow = 0
    }
    else {
        startingStepRow = (actualStep * pagnationStep) - ( pagnationStep + 1)
    }


    lastStepRow = actualStep * pagnationStep
    console.info('startingStepRow: ' + startingStepRow)
    console.info('lastStepRow: ' + lastStepRow)



    //console.info(pagnationString)
    columns.forEach(function (col) {
        var i = 0;
        if( col != findHideCols(col,totHideCols)){
            console.info(col)
            strColumns = strColumns + '<th>' + col + '</th>'
        }
    })


    if (tableDefinition.editRow ==  'Y' ){
        strColumns = strColumns + '<th>edit</th><th>delete</th>'
        updateAftrek =  updateAftrek + 1
    }
    else {
        strColumns = strColumns
    }

    for (var i = 0; i < columns.length; i++){
        colpos.push({column: columns[i], col_pos: i})
    }
    console.info('----------------------------------------------------------------------------------')


    data.forEach(function (row) {
        keys = Object.keys(row)
        lastPos = 0



        // A. First row
        var updateProperties = '<td id="update'+ row['_id'] + '"><span class="glyphicon glyphicon-pencil" onclick="updateField(\'' +columnValue + '\',\'' + row['_id'] +'\',\'' + sourceCollection + '\')"></span></td><td><span class="glyphicon glyphicon-trash" onclick="deleteRow(\'' + row['_id'] +'\')"></td>'
        if (rowNumber == 0 && rowNumber == startingStepRow ){
            strData = '<tr>'
            keys.forEach(function (columKey) {
                colpos.forEach(function (col) {

                    if (col.column == columKey && col.col_pos > lastPos && columKey != findHideCols(columKey, totHideCols)){
                        strData = strData + '<td id="'+ columKey + row['_id'] + '">' + row[columKey] + '</td>'
                        lastPos = col.col_pos
                    }
                })
            })

            if(tableDefinition.editRow ==  'Y' ){
                strData = strData + updateProperties + '</tr>'
            }
            else{
                strData = strData + '</tr>'
            }
        }
        // B. Rows after first row
        if (rowNumber > 0 && rowNumber <=  lastStepRow && rowNumber >= startingStepRow ){
            lastPos = 0
            //B.1 Check if the count of keys is the same as the first row. If it is less then only map the and create a new row

            var countCollsActRow = keys.length - updateAftrek
            var countCollsFirstRow =  columns.length -updateAftrek

            keys.forEach(function (columKey) {
                colpos.forEach(function (col) {
                    if (columKey != findHideCols(columKey, totHideCols) && col.column == columKey && col.col_pos > lastPos ) {
                        colHit = 0

                        // A col_position of the table definition is greather then the last column pos of the dataset and col pos of the table defintion is 0
                        if (lastPos == 0 && colHit == 0) {

                            if (tableDefinition.isEditable == 'N') {
                                strData = strData + '<tr><td id="' + columKey + row['_id'] + '">' + row[columKey] + '</td>'
                            }

                            if (tableDefinition.isEditable == 'Y') {
                                strData = strData + '<tr><td id="' + columKey + row['_id'] + '"><input type="text" id="txt' + columKey + row['_id'] + '">' + row[columKey] + '</input></td>'
                            }
                            lastPos++
                            colHit = 1
                        }

                        // B col_position of the table definition is greather then the last column pos of the dataset and col pos of the table defintion is 0
                        if (lastPos > 0 && lastPos < colpos.length - updateAftrek && colHit == 0 ) {
                            strData = strData + '<td id="' + columKey + row['_id'] + '">' + row[columKey] + '</td>'
                            lastPos++
                            colHit = 1
                        }

                        // C Last Column in the Row
                        if (lastPos == colpos.length - updateAftrek && colHit ==  0 ) {
                            if (tableDefinition.editRow == 'Y') {


                                rowDef = rowDefinition(keys,totHideCols,row['_id'] )


                                updateProperties = '<td id="update'+ row['_id'] + '"><span class="glyphicon glyphicon-pencil" onclick="updateField(\'' +rowDef + '\',\'' + sourceCollection +'\')"></span></td><td><span class="glyphicon glyphicon-trash" onclick="deleteRow(\'' + row['_id'] +'\')"></td>'

                                //console.info(rowDef)
                                strData = strData + '<td id="' + columKey + row['_id'] + '">' + row[columKey] + '</td>' + updateProperties + '</tr>'
                            }
                            else {
                                strData = strData + '<td id="' + columKey + row['_id'] + '">' + row[columKey] + '</td></tr>'
                            }
                        }
                    }
                })
            })
        }
        rowNumber++
    })

    return {tableName: tableDefinition.tableName, strColumns: strColumns, strData: strData, div: tableDefinition.divTable}
}


function findHideCols (columnName, allHideColNames ){
    var hitHide = 0

    allHideColNames.forEach(function (hideColName) {
        if(hideColName == columnName){
            hitHide = 1
        }
    })

    if (hitHide == 1){
        return columnName
    }
    else { return 'N' }
}


function rowDefinition (KeyofColumns, allHideColNames, rowId ){
    var tableDefinition, i = 0
    tableDefinition = rowId

    KeyofColumns.forEach(function (col) {
        if (col != findHideCols(col, allHideColNames)){
            tableDefinition = tableDefinition + ',' + col + rowId
            i++
        }


    })
    return tableDefinition
}

function setPagnation(data, pagnationStep, actualStep ) {
    var pagnationSteps =  data.length/  pagnationStep
    console.info('pagnationsteps: ' + pagnationSteps)
    var paginationHTML = '<ul class="pagination">'
    for (var i = 0; i < pagnationSteps; i++){
        var t = i + 1
        paginationHTML = paginationHTML + '<li><a href="#'+ t +'">'+ i +'</a></li>'
    }

     return paginationHTML
}


exports.getBusinessRuleListFilterList = function (req, res, next) {
    var br = db.get('businessrules')
    console.info('---> getBusinessRuleListFilter <-----')

    br.distinct('typeBusinessRule',function (err, doc) {
        var optionList = '<select class="form-control" id="fltrZoekWaarde">'
        doc.forEach(function (item) {
            optionList = optionList + '<option>'+ item +'</option>'

        })
        optionList = optionList + '</select>'
        console.info(optionList)
        res.status(200).json({message:optionList})

    })








            //res.status(200).json({tableResult: businessrules, pagingResultSet: pagingResultSet })





}