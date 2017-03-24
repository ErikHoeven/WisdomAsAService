/**
 * Created by erik on 3/19/17.
 */


function createGeneric (data, div, tablename){

    var columns = [], strColumns = '', i = 0, strData = '', keys= [],colpos = [], lastPos = -1, countColss, rowNumber = 0
    columns =  Object.keys(data[0])

    columns.forEach(function (col) {
            strColumns = strColumns + '<th>' + col + '</th>'
    })

    for (var i = 0; i < columns.length; i++){

        colpos.push({column: columns[i], col_pos: i})
    }

    data.forEach(function (row) {
        keys = Object.keys(row)
        lastPos = -1

        if (rowNumber == 0 ){
            console.info('RowNumber = 0')
            strData = '<tr>'
            keys.forEach(function (columKey) {
                colpos.forEach(function (col) {
                    if (col.column == columKey && col.col_pos > lastPos ){
                        strData = strData + '<td>' + row[columKey] + '</td>'
                        lastPos = col.col_pos
                    }
                })
            })
            strData = strData + '</tr>'
        }

        if (rowNumber > 0 ){
            console.info('Rownumber > 0')
            keys.forEach(function (columKey) {
                colpos.forEach(function (col) {
                    if (col.column == columKey && col.col_pos > lastPos && col.col_pos  == 0 ){
                        strData = strData + '<tr><td>' + row[columKey] + '</td>'
                        lastPos = col.col_pos
                    }
                    if (col.column == columKey && col.col_pos > lastPos && col.col_pos  > 0 && col.col_pos < colpos.length - 1 ){
                        strData = strData + '<td>' + row[columKey] + '</td>'
                        lastPos = col.col_pos
                    }
                    if (col.column == columKey && col.col_pos > lastPos && col.col_pos  > 0 && col.col_pos == colpos.length - 1 ){
                        strData = strData + '<td>' + row[columKey] + '</td></tr>'
                        lastPos = col.col_pos
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

            console.info(updateSet)

            $.ajax({
                url: '/BusinessRules/updSentiment',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({updateSet: updateSet}),
                success: function (response) {
                    createGeneric(response.result,'tblBusinessrules','tblSentimentWoorden')
                    $('#btnSentiment').html('<button type="button" id="cmdbuildTrainingSet" class="btn btn-primary">Build TrainingSet</button>')
                    createTrainingSet('cmdbuildTrainingSet')
                }
            });

    })
}




