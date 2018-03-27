



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
    console.info('value:' +  value)
    var valuelist = [], valueRecord = ''

    var fields = column.split(','), updateSet = [], value, updateRow = {}
    console.info('-----------------------------------------------------')
    fields.forEach(function (field) {
        $('.' + field).each(function (idx, elem) {


            if (!$(elem).html()){
                valueRecord =  $(elem).val()
            }
            else {
                valueRecord = $(elem).html()
            }

            valuelist.push(valueRecord)
        })

        column = field.replace('txt','').replace(id,'')
        updateRow[column] = valuelist
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

          location.reload()

/*          var tableDefinition = {}
          tableDefinition.divTable = 'tblBusinessrules'
          tableDefinition.tableName = 'searchCondititions'
          tableDefinition.keyColumn = ['_id']
          tableDefinition.hideColumns = ['searchReturnValue','__v','search','userId']
          tableDefinition.title = 'Search conditions'
          tableDefinition.editRow = 'Y'
          tableDefinition.isEditable = 'N'
          tableDefinition.sourceCollection = 'businessrules'

          createGenericTable(response, tableDefinition)*/

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


function createNewTableData (data, tableDefinition, pagnationStep, actualStep){
    console.info(pagnationStep)
    console.info(actualStep)

}

var term = [], lastKnownPos = 0
function autocompletionLookupValue(val, pos) {
    console.info(term)
    arrayLenght = term.length
    console.info('execute autocompletion:')

    if (val.key == 'Backspace'){
        term.splice(lastKnownPos-1,1)
    }

    if (val.key == 'ArrowLeft' || val.key == 'ArrowRight'){
        // get from current position the array position
        pos = document.getElementById('searchLookupTerm').selectionStart
        // previous char would be deleted (Backspace)
        lastKnownPos = pos
    }


    if(pos == arrayLenght + 1 && val.key != 'BackSpace' ) {
        term.push({pos: term.length + 1, searchTerm: val.key})
    }

return term
}

function searchArray(column, id, sourceCollection, edit){
    console.info('searchArray')
    var strTable = '<table class="table table-hover" id="valueDetails"><thead><tr><th>values</th></tr></thead><tbody>'
    var strTableBody = ''
    var dynButton = '<button id="edit" type="button" class="btn btn-primary" data-toggle="modal" onclick="searchArray(\'' +column + '\',\'' + id +'\',\'' + sourceCollection + '\',\'Y\')">Edit</button> '




    $.ajax({
        url: '/BusinessRules/getSearchResultArray',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id, column: column}),
        success: function (response) {
            var i = 0

            if (edit == 'N'){
                // (A table body for non edit modus
                response.forEach(function (v) {
                strTableBody = strTableBody + '<tr><td class="'+ column+'">'+ v +'</td><tr></tr>'
                })

            }
            else {
                response.forEach(function (v) {
                    strTableBody = strTableBody + '<tr><td><input type="text" class="'+ column + '" value="'+ v +'"></td><tr></tr>'
                    i++

                    dynButton = '<button id="save" type="button" class="btn btn-primary" data-toggle="modal" onclick="update(\'' +column + '\',\'' + id +'\',\'' + sourceCollection + '\')">Save</button> '

                })
            }

            // (1) Hide all unnesserly information
            $('#fltrZoekWaarde').hide()
            $('#searchLookupTerm').hide()
            $('#pagnationOption').hide()
            $('#addSearchRules').hide()
            $('#sentiment').hide()
            $('.pagination').hide()
            $('#rowsPerPage').hide()

            // (2)  Build detail screen
            var table = 'valueDetails'
            $('#filterContent').attr('class', 'col-md-8')
            $('#filterContent').html('<div class="col-md-8">' +
                '<div class="thumbnail"><div class="caption">' +
                '<h4>' + column + '</h4>' +
                 strTable + strTableBody +'</tbody></table></p> </div> <div class="ratings"> ' +
                '</div> <div class="space-ten">' +
                '</div> <div class="btn-ground text-center" id="butonGroup"> ' +
                dynButton +
                '<button type="button" class="btn btn-primary" data-toggle="modal" onclick="addValue(\'' + table + '\',\'' + column + '\',\'' + id +'\',\'' + sourceCollection + '\')">Add</button> ' +
                '<button type="button" class="btn btn-primary" data-toggle="modal">Close</button></div> ' +
                '<div class="space-ten"></div></div></div>')
        }
    })
}




function addValue(table, column, id, sourceCollection) {
    $('#' + table + '> tbody').append('<tr><td><input type="text" class="'+ column+'"></td></tr>')

    var saveButonExist = $('#save').length
    console.info(saveButonExist)
    if (saveButonExist == 0 ){
        $('#butonGroup').append('<button type="button" class="btn btn-primary" data-toggle="modal" onclick="update(\'' +column + '\',\'' + id +'\',\'' + sourceCollection + '\')" id="save">Save</button>')
        $('#edit').hide()
    }




}



