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


function createGenericTable (data, tableDefinition){

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


    columns =  Object.keys(data[0])
    console.info('-------------------')
    console.info('titel: ' + tableDefinition.title)
    console.info('KeyColumn: ' + tableDefinition.keyColumn)
    console.info('hideColls:' + totHideCols )
    console.info('cols: ' +  columns)
    console.info('totHideCols: ' +  totHideCols.length)
    console.info('div place: ' + tableDefinition.divTable )
    console.info('div name: ' + tableDefinition.tableName)
    updateAftrek = totHideCols.length
    console.info(columns )



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
    console.info('-----------------------')


    data.forEach(function (row) {
        keys = Object.keys(row)
        lastPos = 0



        // A. First row
        var updateProperties = '<td id="update'+ row['_id'] + '"><span class="glyphicon glyphicon-pencil" onclick="updateField(\'' +columnValue + '\',\'' + row['_id'] +'\',\'' + sourceCollection + '\')"></span></td><td><span class="glyphicon glyphicon-trash" onclick="deleteRow(\'' + row['_id'] +'\')"></td>'
        if (rowNumber == 0 ){
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
        if (rowNumber > 0 ){
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
                        if (lastPos > 0 && lastPos < colpos.length - updateAftrek && colHit == 0) {
                            strData = strData + '<td id="' + columKey + row['_id'] + '">' + row[columKey] + '</td>'
                            lastPos++
                            colHit = 1
                        }

                        // C Last Column in the Row
                        if (lastPos == colpos.length - updateAftrek && colHit ==  0) {
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

    $('#' + tableDefinition.divTable).html('')
    $('#' + tableDefinition.divTable).append('<table class="table table-hover" id="' + tableDefinition.tableName +'">')
    $('#' + tableDefinition.tableName).append('<thead>><tr>' +  strColumns + '</tr></thead>')
    $('#' + tableDefinition.tableName).append('<tbody>' + strData + '</tbody></table>')
}

function createSentimentTable(data,div, tablename, button) {
    var columns = [], strColumns = '', i = 0, strData = '', keys= [],colpos = [], lastPos = -1, countColss, rowNumber = 0

    strColumns = '<thead><tr><th>_id</th><th>ScoreWoord</th><th>Score</th></tr>'

    data.forEach(function (word) {
        if (i == 0){strData = '<tr><td><input type="hidden" id="id_'+ i +'" value="'+ word._id +'"/> '+ i + '</td><td>' + word.woord + '</td><td><input type="text" id="score'+ i +'"></input></td> </tr>'
        }
        if (i > 0){
            strData = strData + '<tr><td><input type="hidden" id="id_'+ i +'" value="'+ word._id +'"/> '+ i + '</td><td>' + word.woord + '</td><td><input type="text" id="score'+ i +'"></input></td></tr>'
        }
      i++
    })

    $('#' + div).html('')
    $('#' + div).append('<table class="table table-hover" id="' + tablename +'">')
    $('#' + tablename).append('<thead>><tr>' +  strColumns + '</tr></thead>')
    $('#' + tablename).append('<tbody>' + strData + '</tbody></table>')
    $('#' + button).html('<button type="button" id="updSentiment" class="btn btn-primary">update Sentiment Score</button>')

    $('#updSentiment').click(function () {

            var updateSet = [], updateRow= {}

            for (var i = 0; i < data.length; i++){
                updateRow = {}
                updateRow.id = $('#id_' + i).val()
                updateRow.score = $('#score' + i).val()
                updateSet.push(updateRow)
            }

            $.ajax({
                url: '/BusinessRules/updSentiment',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({updateSet: updateSet}),
                success: function (response) {
                    createGeneric(response.result,'tblBusinessrules','tblSentimentWoorden', 0, null, null, 'Sentiment woorden')
                    $('#btnSentiment').html('<button type="button" id="cmdbuildTrainingSet" class="btn btn-primary">Build TrainingSet</button>')
                    createTrainingSet('cmdbuildTrainingSet')
                    showTrainingSetOptions('trainingSetOptions')

                }
            });

    })
}

function updateField(row, sourceCollection) {
    console.info('updateFields')
    console.info(sourceCollection)
    var rows = row.split(','), i = 0, id = rows[0], column
    // Update td to input fields
    rows.forEach(function (r) {
        if (i > 0 ){
            var value = $('#' + r).text()
            $('#' + r).html('<input id="txt' + r + '" type="text" value="'+ value  + '"></input>')

            if (i == 1){
                column = 'txt' + r
            }
            if ( i > 1 ){
                column = column + ',txt' + r
            }
        }
        i++
    })



    //Change Pencil to save button
        $('#update' + id).html('<button id="cmdSave" type="button" class="btn btn-default btn-sm" onclick="update(\'' +column + '\',\'' + id +'\',\'' + sourceCollection + '\')"><span class="glyphicon glyphicon-ok"></span></button>')



    //$('#' + column + id).html('<input id="txt'+ column + id + '" type="text" value="'+ score  +'"></input>')

    //    '<span class="glyphicon glyphicon-ok"></span></button>')

    //var score = $('#' + column + id).html()


}

function update(column, id, sourceCollection) {
    console.info('updateConfirmed:')
    console.info('---------------------')
    console.info('column: ' + column)
    console.info('id: ' + id)

    var fields = column.split(','), updateSet = [], value, updateRow = {}

    fields.forEach(function (field) {
        value = $('#' + field).val()
        column = field.replace('txt','').replace(id,'')
        updateRow[column] = value
        updateRow.id = id
        updateRow.collection = sourceCollection
        updateSet.push(updateRow)
    })

    console.info(updateSet[0])


    $.ajax({
      //url: '/BusinessRules/updateTrainingSet',
      url: '/BusinessRules/updateGeneric',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({updateSet: updateSet[0]}),
      success: function (response) {

         console.info(response)

          var tableDefinition = {}
          tableDefinition.divTable = 'tblBusinessrules'
          tableDefinition.tableName = 'tblSentiment'
          tableDefinition.keyColumn = ['_id']
          tableDefinition.hideColumns = ['searchReturnValue','cattegoryValue','__v','search']
          tableDefinition.title = 'Business Rules'
          tableDefinition.editRow = 'Y'
          tableDefinition.isEditable = 'N'
          tableDefinition.sourceCollection = 'businessrules'

          createGenericTable(response, tableDefinition)

        //createGeneric(trainingset, 'tblBusinessrules', 'trainingSet', 1, 'score', '_id', 'Update Training set for Sentiment Model')

         }
      })

    console.info('---------------------')

}

function deleteRow(id){
    $.ajax({
        url: '/BusinessRules/deleteRowTrainingsSet',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({deleteKey: id}),
        success: function (response) {
            var trainingset = []
            response.forEach(function (row) {
                trainingset.push({tekst: row.tekst, score: row.score, _id: row._id })
            })
            createGeneric(trainingset, 'tblBusinessrules', 'trainingSet', 1, 'score', '_id', 'Update Training set for Sentiment Model')

        }
    })
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




