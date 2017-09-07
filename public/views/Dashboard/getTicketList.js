function  getTicketList(data, filter, pagnationStep, ActualStep) {
    var tickets
    //console.info('FILTER TYPE: ' +  filter.prop.constructor )
    console.info('FILTER: ' + Array.isArray(filter))

    if (Array.isArray(filter) != true){
        console.info('filter is object')
        if (filter != 'All'){
            tickets = _.where(data,{'Responsible Group': filter.Group, State: filter.State})
        }
        else {
            tickets = _.where(data,{State: filter.State})
        }
    }
    else {
        var test = []
        var tickets = []

        filter.forEach(function (f) {
            test = _.where(data,{'Responsible Group': f.Group, State: f.State})
            Array.prototype.push.apply(tickets, test)
            //console.info(f)
            //console.info(test)
        })
        console.info(tickets)

    }

    var tableDefinition = {}
    tableDefinition.divTable = 'ticketsList'
    tableDefinition.tableName = 'tblticketsList'
    tableDefinition.keyColumn = ['_id']
    tableDefinition.hideColumns = [  'Company'
                                    ,'Customer Reference'
                                    ,'count'
                                    ,'Customer Free Text'
                                    ,'ticketType'
                                    ,'EPS - Cognos_Count'
                                    ,'Last Change',
                                    'Responsible Group',
                                    'snapshotDate',
                                    'lastChange',
                                    '',
                                    'aggGrain',
                                    'Reason for waiting']
    tableDefinition.title = 'Business Rules'
    tableDefinition.editRow = 'Y'
    tableDefinition.isEditable = 'N'
    tableDefinition.sourceCollection = 'stgOmniTracker'
    console.info('tickets after filter')
    console.info(tickets)
    console.info('Gen Table')

    if (filter.Group == 'EPS - SRL_Count'){
        console.info('EPS - SRL_Count Hit')
        tableDefinition.hideColumns.push('EPS - SRL_Count')
    }
    return  genericTable (tickets, tableDefinition, pagnationStep, ActualStep )

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
    var pagnationSteps =  Math.ceil(data.length/  pagnationStep)
    console.info('steps: ' + pagnationSteps)
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
    console.info('Clean columns: ' + ( colpos.length - updateAftrek ))
    console.info(updateAftrek)
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
                        //console.info(row[columKey] + ' : ' + Array.isArray(row[columKey]))

                        if (Array.isArray(row[columKey]) == false){
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
                    if (row[columKey].length == 0 ){
                        row[columKey] = 'NaV'

                    }
                    if (columKey != findHideCols(columKey, totHideCols) && col.column == columKey && col.col_pos > lastPos ) {
                    colHit = 0
                        //console.info(columKey + ':' +row[columKey] + ' : ' + lastPos + ' : ' + colHit + ' : ' +  ( colpos.length - (updateAftrek + 1)))

                        // A col_position of the table definition is greather then the last column pos of the dataset and col pos of the table defintion is 0
                        if (lastPos == 0 && colHit == 0) {
                            //console.info('SCANARIO A:' + row[columKey] + ' : ' + columKey + ' : ' + colHit + ' : ' + lastPos + ' : ' + colpos.length)

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
                        if (lastPos > 0 && lastPos < (colpos.length - updateAftrek) && colHit == 0 ) {
                            //console.info('SCANARIO B:' + row[columKey] + ' : ' + columKey + ' : ' + colHit + ' : ' + lastPos + ' : ' + (colpos.length - updateAftrek))
                            strData = strData + '<td id="' + columKey + row['_id'] + '">' + row[columKey] + '</td>'
                            lastPos++
                            colHit = 1
                        }

                        // C Last Column in the Row
                        if (lastPos == ( colpos.length - (updateAftrek )) && colHit ==  0 ) {
                            //console.info('SCANARIO C:' + row[columKey] + ' : ' + columKey + ' : ' + colHit + ' : ' + lastPos + ' : ' + (colpos.length - updateAftrek))
                            if (tableDefinition.editRow == 'Y') {
                                rowDef = rowDefinition(keys,totHideCols,row['_id'] )
                                updateProperties = '<td id="update'+ row['_id'] + '"><span class="glyphicon glyphicon-pencil" onclick="updateField(\'' +rowDef + '\',\'' + sourceCollection +'\')"></span></td><td><span class="glyphicon glyphicon-trash" onclick="deleteRow(\'' + row['_id'] +'\')"></td>'
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


function searchDefiniton(KeyColumn, rowId) {

}


function setPagnation(data, pagnationStep, actualStep, filter ) {
    if (filter != 'All'){
        tickets = _.where(data,{'Responsible Group': filter.Group, State: filter.State})
    }
    else {
        tickets = _.where(data,{State: filter.State})
    }


    console.info('dataLenght:' + tickets.length )
    var pagnationSteps =  tickets.length/  pagnationStep
    console.info('pagnationsteps: ' + pagnationSteps)
    var paginationHTML = '<ul class="pagination">'
    for (var i = 0; i < pagnationSteps; i++){
        var t = i + 1
        paginationHTML = paginationHTML + '<li><a href="#'+ t +'">'+ i +'</a></li>'
    }

    return paginationHTML
}


function update(column, id, sourceCollection) {
    console.info('updateConfirmed:')
    console.info('---------------------')
    console.info('column: ' + column)
    console.info('id: ' + id)
    console.info('value:' + value)
    var valuelist = [], valueRecord = ''

    var fields = column.split(','), updateSet = [], value, updateRow = {}
    console.info('-----------------------------------------------------')
    fields.forEach(function (field) {
        $('.' + field).each(function (idx, elem) {


            if (!$(elem).html()) {
                valueRecord = $(elem).val()
            }
            else {
                valueRecord = $(elem).html()
            }

            valuelist.push(valueRecord)
        })

        column = field.replace('txt', '').replace(id, '')
        updateRow[column] = valuelist
        updateRow.id = id
        updateRow.collection = sourceCollection
        updateSet.push(updateRow)
    })

    console.info(updateSet[0])

}
/*    $.ajax({
        url: '/Dashboard/update',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({updateSet: updateSet[0]}),
        success: function (response) {

            console.info(response)

            location.reload()

        }
    })
}
 */


function updateField(row, sourceCollection) {
    console.info(' -- updateFields --')
    console.info(sourceCollection)

    var rows = row.split(','), i = 0, id = rows[0], column
    //console.info(rows[2].replace(/\n/g, " "))
    console.info($("[id='Affected Person59a9534a5560ad4272f88603']").text())
    // Update td to input fields



    rows.forEach(function (r) {
        if (i > 0 ){
            var value = $('[id="' + r + '"]').text()
            $('[id="' + r + '"]').html('<input id="txt' + r + '" type="text" value="'+ value  + '"></input>')

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

}