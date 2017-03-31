/**
 * Created by erik on 3/24/17.
 */
function showTrainingSetOptions(div){
    var label, select = []

    label = '<label>Percentage van ... Tweets  :</label>'

    for (var i = 0; i < 110; i+=10){

        if( i == 0){
            select = '<option>'+ i + '%</option>'
        }
        else {
            select = select + '<option>'+ i + '%</option>'
        }

    }
    $('#' + div).append(label)
    $('#' + div).append('<select id="lstTrainingSet">' + select + '</select>')

}


function createTrainingSet(divButton){
    $('#'+ divButton).click(function () {
        var trainingSetSize = $('#lstTrainingSet option:selected').text().replace('%','')
        $.ajax({
            url: '/BusinessRules/BuildSentimentModel',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({trainingSetSize: trainingSetSize}),
            success: function (response) {
                createGeneric(response, 'tblBusinessrules', 'trainingSet', 1, 'score', '_id', 'Training set for Sentiment Model')
                $('#trainingSetOptions').html('')
                $('#btnSentiment').html('<button type="button" id="cmdBuildModel" class="btn btn-primary">Build Sentiment Model</button>')
            }
        });
    });
}

function buildSentimentModel() {
    console.info('BuildModel')
    // AJAX to Server Script buidlSentiment zonder input is message output is also message
    $.ajax({
        url: '/BusinessRules/model',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({message: 'BuildModel'}),
        success: function (response) {
            createGeneric(response, 'tblBusinessrules', 'trainingSet', 1, 'score', '_id', 'Training set for Sentiment Model')
            $('#trainingSetOptions').html('')
            $('#btnSentiment').html('<button type="button" id="cmdBuildModel" class="btn btn-primary">Build Sentiment Model</button>')
        }
    });


    // return to main

}
