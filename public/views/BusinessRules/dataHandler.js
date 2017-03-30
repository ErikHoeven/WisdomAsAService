/**
 * Created by erik on 3/19/17.
 */


function createGeneric (data, div, tablename, updateRows, columnValue, hideKeyColumn, titel){

    var columns = [], strColumns = '', i = 0, strData = '', keys= [],colpos = [], lastPos = -1, countColss, rowNumber = 0, updateProperties, updateAftrek = 1
    columns =  Object.keys(data[0])
    console.info('---------------------------------------------')
    console.info('titel: ' + titel)
    console.info('hideKeyColumn: ' + hideKeyColumn)
    console.info('updateRows:' + updateRows )
    console.info('columnValue: ' + columnValue)
    console.info(data[0])
    console.info(data[1])




    columns.forEach(function (col) {
            if (col != hideKeyColumn){
                strColumns = strColumns + '<th>' + col + '</th>'
            }
    })


    if (updateRows == 1 ){
        strColumns = strColumns + '<th>edit</th><th>delete</th>'
        updateAftrek = 2
    }
    else {
        strColumns = strColumns
    }


    for (var i = 0; i < columns.length; i++){
          colpos.push({column: columns[i], col_pos: i})
    }

    console.info(colpos)
    console.info('---------------------------------------------')


    data.forEach(function (row) {
        keys = Object.keys(row)
        lastPos = -1
        updateProperties = '<td><span class="glyphicon glyphicon-pencil" onclick="updateField(\'' +columnValue + '\',\'' + row['_id'] +'\')"></span></td><td><span class="glyphicon glyphicon-trash" onclick="deleteRow(\'' +columnValue + '\',\'' + row['_id'] +'\')"></td>'


        if (rowNumber == 0 ){
            strData = '<tr>'
            keys.forEach(function (columKey) {
                colpos.forEach(function (col) {

                    if (col.column == columKey && col.col_pos > lastPos && columKey != hideKeyColumn){
                        strData = strData + '<td id="'+ columKey + row['_id'] + '">' + row[columKey] + '</td>'
                        lastPos = col.col_pos
                    }
                })
            })

            if(updateRows == 1 ){
                strData = strData + updateProperties + '</tr>'
            }
            else{
                strData = strData + '</tr>'
            }
        }
        if (rowNumber > 0 ){
            keys.forEach(function (columKey) {
                colpos.forEach(function (col) {
                    if (columKey != hideKeyColumn || !hideKeyColumn){

                        //console.info('ColPos: ' + col.col_pos + ' columnkey: ' +  columKey + 'col.column: ' + col.column)
                        if (col.column == columKey && col.col_pos > lastPos && col.col_pos  == 0 ){

                            strData = strData + '<tr><td id="'+ columKey + row['_id'] + '">' + row[columKey] + '</td>'
                            lastPos = col.col_pos
                        }
                        if (col.column == columKey && col.col_pos > lastPos && col.col_pos  > 0 && col.col_pos < colpos.length - updateAftrek ){
                            console.info(columKey)
                                strData = strData + '<td id="'+ columKey + row['_id'] + '">' + row[columKey] + '</td>'
                                lastPos = col.col_pos
                        }
                        if (col.column == columKey  && col.col_pos == colpos.length - updateAftrek ){
                            if (updateRows == 1){
                                console.info('LastPos: ' + col.col_pos + ' columnkey: ' +  columKey)
                                strData = strData + '<td id="'+ columKey + row['_id'] + '">' + row[columKey] + '</td>'+ updateProperties + '</tr>'
                            }
                            else {
                                strData = strData + '<td id="'+ columKey + row['_id'] + '">' + row[columKey] + '</td></tr>'
                            }

                            lastPos = col.col_pos
                        }
                    }
                })
            })

        }
        rowNumber++
    })

    $('#' + div).html('')
    $('#' + div).append('<table class="table table-hover" id="' + tablename +'">')
    $('#' + tablename).append('<thead>><tr>' +  strColumns + '</tr></thead>')
    $('#' + tablename).append('<tbody>' + strData + '</tbody></table>')

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

function updateField(column, id) {
    console.info('Column: ' + column)
    console.info('id: ' + id)
    console.info('score: '+ $('#' + column + id).html())
    var score = $('#' + column + id).html()

    $('#' + column + id).html('<input id="txt'+ column + id + '" type="text" value="'+ score  +'"></input>')
    $('#' + column + id).append('<button id="cmdSave" type="button" class="btn btn-default btn-sm" onclick="update(\'' +column + '\',\'' + id +'\')">' +
        '<span class="glyphicon glyphicon-ok"></span></button>')
}

function update(column, id) {
    console.info('updateConfirmed')
    var element = 'txt' + column + id
    console.info(element)
    var score = $('#' + element).val()

    $.ajax({
     url: '/BusinessRules/updateTrainingSet',
     type: 'POST',
     contentType: 'application/json',
     data: JSON.stringify({updateValue: score, updateKey: id, updateColumn: column}),
     success: function (response) {

         var trainingset = []
         response.forEach(function (row) {
             trainingset.push({tekst: row.tekst, score: row.score, _id: row._id })
         })
         console.info(trainingset)
         columns =  Object.keys(trainingset[0])
         //console.info(columns)
         createGeneric(trainingset, 'tblBusinessrules', 'trainingSet', 1, 'score', '_id', 'Update Training set for Sentiment Model')

        }
     })
}

function deleteRow(id){


    $.ajax({
        url: '/BusinessRules/deleteTrainingSet',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({deleteKey: id}),
        success: function (response) {

            var trainingset = []
            response.forEach(function (row) {
                trainingset.push({tekst: row.tekst, score: row.score, _id: row._id })
            })
            console.info(trainingset)
            columns =  Object.keys(trainingset[0])
            //console.info(columns)
            createGeneric(trainingset, 'tblBusinessrules', 'trainingSet', 1, 'score', '_id', 'Update Training set for Sentiment Model')

        }
    })
}








