/**
 * Created by erik on 6/4/17.
 */
var cheerio = require("cheerio")
    ,request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,db = require('monk')('localhost/commevents')
    ,dbm = require('mongodb').MongoClient
    ,underscore = require('underscore')
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
    columns.push('developer')
    columns.push('percentage')
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
    console.info(columns.length -  updateAftrek)
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
    console.info(colpos)
    console.info('----------------------------------------------------------------------------------')


    data.forEach(function (row) {
        keys = Object.keys(row)
        lastPos = 0
        var countcolLeft = columns.length - totHideCols.length
        var colsLeft = reduceArray(keys,totHideCols, colpos)
        var countKeysLeft = countcolLeft - colsLeft.length
        var isLastColumn = 0

        //Find lastCol in colpos
        //A RESET COLUMN
        colpos.forEach(function (cp) {
          cp.isLastCol  = 0
        })


        colpos.forEach(function (cp) {
            colsLeft.forEach(function (cl) {
                if(cp.column == cl.column && cl.last_pos == 1){
                    cp.isLastCol = 1
                }
                else{
                    isLastColumn = 0
                }
            })
        })
        //console.info('------------------')
        //console.info(colpos)
        //console.info('------------------')








        // A. First row
        var updateProperties = '<td id="update'+ row['_id'] + '"><span class="glyphicon glyphicon-pencil" onclick="updateField(\'' +columnValue + '\',\'' + row['_id'] +'\',\'' + sourceCollection + '\')"></span></td><td><span class="glyphicon glyphicon-trash" onclick="deleteRow(\'' + row['_id'] +'\')"></td>'
        if (rowNumber == 0 && rowNumber == startingStepRow ){
            strData = '<tr>'
            keys.forEach(function (columKey) {
                colpos.forEach(function (col) {


                    if (col.column == columKey && col.col_pos > lastPos && columKey != findHideCols(columKey, totHideCols)){

                        if (Array.isArray(row[columKey]) == false || row[columKey].length == 0){
                            strData = strData + '<td id="'+ columKey + row['_id'] + '">' + row[columKey] + '</td>'
                        }
                        else {
                            strData = strData + '<td id="'+ columKey + row['_id'] + '" align="center"><i class="fa fa-binoculars" onclick="searchArray(\'' +columKey + '\',\'' + row['_id'] +'\',\'' + sourceCollection + '\',\'N\')"></i></td>'
                        }
                        lastPos = col.col_pos
                    }

                })
            })

            if(tableDefinition.editRow ==  'Y' ){

                var strTD = ''

                for(var i = 0;  i < countKeysLeft ; i++){
                    strTD = strTD + '<td></td>'
                }

                strData = strData + strTD + updateProperties + '</tr>'

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
                        console.info('lastPos: ' + lastPos + ' col.col_pos: ' + col.col_pos + ' lastCol: ' + col.isLastCol + ' colHit: ' + colHit )
                        console.info('-----------COLPOS----------')
                        console.info(colpos)
                        colHit = 0

                        // A col_position of the table definition is greather then the last column pos of the dataset and col pos of the table defintion is 0
                        if (lastPos == 0 && colHit == 0 && col.isLastCol == 0) {

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
                        if (lastPos > 0 && lastPos < colpos.length - updateAftrek && colHit == 0 && col.isLastCol == 0 ) {
                            strData = strData + '<td id="' + columKey + row['_id'] + '">' + row[columKey] + '</td>'
                            lastPos++
                            colHit = 1
                        }

                        // C Last Column in the Row
                        if ( colHit ==  0 && col.isLastCol == 1) {
                            console.info('Last Col in Row')
                            if (tableDefinition.editRow == 'Y') {
                                console.info('colpos.length')

                                var countcolLeft = columns.length - totHideCols.length,
                                    countKeysLeft = countcolLeft - reduceArray(keys,totHideCols, colpos).length,
                                    strTD = ''

                                console.info(countcolLeft)
                                for(var i = 0;  i < countKeysLeft ; i++){
                                    strTD = strTD + '<td></td>'
                                }



                                rowDef = rowDefinition(keys,totHideCols,row['_id'] )


                                updateProperties = '<td id="update'+ row['_id'] + '"><span class="glyphicon glyphicon-pencil" onclick="updateField(\'' +rowDef + '\',\'' + sourceCollection +'\')"></span></td><td><span class="glyphicon glyphicon-trash" onclick="deleteRow(\'' + row['_id'] +'\')"></td>'
                                strData = strData + strTD + '<td id="' + columKey + row['_id'] + '">' + row[columKey] + '</td>' + updateProperties + '</tr>'
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


function searchDefiniton(KeyColumn, rowId) {

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
}

exports.getBusinessRuleFilter = function (req, res, next) {

    var lookupterm = '', term = req.body.term, tableDefinition = req.body.tableDefinition, category = req.body.cattegory


    term.forEach(function (t) {
        lookupterm = lookupterm +  t.searchTerm
    })


    console.info(lookupterm)

    mongo.connect(uri, function (err, db) {

        console.info('MONGODB START CHECK COLLECTIONS')

        var locals = {}, tasks = [
            // Load tmp
            function (callback) {
                db.collection('businessrules').find({$and:[{$or:[{"lookupValue": {$regex: ".*" + lookupterm + ".*"}},{"tagCattegory": {$regex: ".*" + lookupterm + ".*"}}]}]}).toArray(function (err, businessrules) {
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

            console.info(businessrules.length)
            if (businessrules.length == 0){
                res.status(200).json({status: 'error' ,message: 'Not the right combination of characters!!'})
            }
            else {

                if ( category == null){
                    var tableResult = genericTable(businessrules, tableDefinition, 10, 1)
                    var pagingResultSet = setPagnation(businessrules, 10,1)
                }
                else {
                    console.info('--------------- Cattegory not null -----------------------------------')
                    var newbusinessrules = fltrArray(businessrules, category)

                    if (newbusinessrules.length > 0){
                        console.info(newbusinessrules)
                        var tableResult = genericTable(newbusinessrules, tableDefinition, 10, 1)
                        var pagingResultSet = setPagnation(newbusinessrules, 10,1)
                        res.status(200).json({tableResult: tableResult, pagingResultSet: pagingResultSet, status: 'succes', message: 'refresh table succesfull' })
                    }
                    else {
                        res.status(200).json({status: 'error' ,message: 'Not the right combination of characters!!'})
                    }

                }
            }
        })
    })
}



function fltrArray (array, fltr){
    console.info('------------------- START FILTER ----------------------')
    var rsltArray = []
    array.forEach(function (r) {
        if (r.typeBusinessRule == fltr){
            console.info(r)
            rsltArray.push(r)
        }
    })
    return rsltArray
}

function reduceArray(array, filterArray, colpos) {
    var keysLeft = [], keyNotMatch = 0, strKey = '', i = 0
    array.forEach(function (k) {
        filterArray.forEach(function (h) {
            if (k != h && keyNotMatch == 0){
                strKey = k
                keyNotMatch = 0
            }
            else{
                strKey = ''
                keyNotMatch = 1
            }
        })
        if(keyNotMatch == 0){
            keysLeft.push({column: strKey})
            keyNotMatch = 0
            i++
        }
        else {
            keyNotMatch = 0
        }
    })

    var keyNotMatch = 0 , order = 0
    keysLeft.forEach(function (kc) {
        colpos.forEach(function (cp) {
            if (kc.column == cp.column && keyNotMatch == 0){
                keyNotMatch = 1
                order = cp.col_pos
            }
        })
        if (keyNotMatch == 1){
            kc.col_pos = order
            keyNotMatch = 0
        }
    })

    var colposValues = [], last

    keysLeft.forEach(function (r) {
        colposValues.push(r.col_pos)
    })
    last = d3.max(colposValues)
    keysLeft.forEach(function (k) {
        if (k.col_pos == last){
            k.last_pos = 1
        }
        else {
            k.last_pos = 0
        }
    })

    return keysLeft

}




