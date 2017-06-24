



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


function createNewTableData (data, tableDefinition, pagnationStep, actualStep){
    console.info(pagnationStep)
    console.info(actualStep)

}

var term = [], lastKnownPos = 0

function autocompletionLookupValue(val, pos) {
    arrayLenght = term.length
    console.info(pos)


    if (val.key == 'Backspace'){
        term.splice(lastKnownPos-1,1)
        console.info(term)
    }
    if (val.key == 'ArrowLeft' || val.key == 'ArrowRight'){
        // get from current position the array position
        pos = document.getElementById('searchLookupTerm').selectionStart
        // previous char would be deleted (Backspace)
        lastKnownPos = pos
    }


    if(pos == arrayLenght + 1 && val.key != 'BackSpace' ) {
        term.push({pos: term.length + 1, searchTerm: val.key})
        console.info(term)

    }

}

