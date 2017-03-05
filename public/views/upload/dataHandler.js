/**
 * Created by erik on 2/5/17.
 */

function searchData (readFile, scores) {
    // Autocompletion
    if(readFile == 1){
        $('#displayReadedDataSection').append('<p></p><h3>DATA IS INGELEZEN</h3></p><br>')
        $('#displayReadedDataSection').append('<label for="searchDataSectie">searchDataSectie: </label>')
        $('#displayReadedDataSection').append('<input id="searchDataSectie">')

        var names = []

        scores.forEach(function(score){
            names.push(score.scoreword)
        })

        $( "#searchDataSectie" ).autocomplete({source: names })



        $("#searchDataSectie").keypress(function (e) {
            if (e.which == 13) {
                $('#translate').html('')
                //console.info($("#searchDataSectie").val())

                //translateSearchResult($("#searchDataSectie").val(),names)
                //var data = {lstWoorden: scores}
                //console.info(data)
                $.ajax({
                    url: '/upload/tranlateWords',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({selectedText: $("#searchDataSectie").val(), fileName: scores[0].files}),
                    success: function (response) {
                        console.info(response)
                        translateSearchResult(response)
                    }
                });
            }
        });
    }
return 0
}

function translateSearchResult(searchWords){
    var i = 0, alreadyTranslated
    //$('#translate').html('')



    if(searchWords){
        $('#translate').append('<table class="table table-hover" id=lstWoord ><thead><tr><th> Translated Word </th><th> Translation </th><th> Score </th><th> Already translated </th>')
        $('#lstWoord').append('<tbody>')

        searchWords.forEach(function(word){
            console
            if (word.IsUpdated == 0){
                console.info('UnChecked')
                alreadyTranslated = '<input type="checkbox" name="chk_AlreadyTranslated" value="'+ word.IsUpdated +'">'
            }
            else{
                console.info('Checked')
                alreadyTranslated = '<input type="checkbox" name="chk_AlreadyTranslated" value="'+ word.IsUpdated +'" checked>'
            }

            $('#lstWoord > tbody').append('<tr><td>'+  word.ScoreWord  +'</td><td><input type="text" id="txtTranslation" value= "' + word.translation +'"></td><td><input type="text" name="txtScore" value="'+ word.score +'"></td><td>'+ alreadyTranslated  +'</td></tr>')
            i++
        })

        console.info('Save Button')
        $('#translate').append('<button type="button" id="updateTranslation" class="btn btn-primary">Save</button>')

        $('#updateTranslation').click(function() {
            var translatedValue = [], i = 0
            console.info('START SAVING')
            readFile = 1

            $('input[id="txtTranslation"]').each(function () {

                translatedValue.push({lookupWord: searchWords[i].ScoreWord
                                    , TranlatedWord: this.value
                                    , IsAlreadyTranslated: searchWords[i].IsTranslated||0
                                    , score: searchWords[i].score
                                    })
                i++
            });

            console.info(translatedValue)
            saveTranslatedWords(translatedValue)
        })

    }
    else {
            console.info('--- No data found ---')
    }
}




function saveTranslatedWords(updateValue) {

    $.ajax({
        url: '/upload/saveTranlateWords',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({updateValue:updateValue}),
        success: function (response) {
            console.info(response)
            //translateSearchResult(response)
        }
    });
}

