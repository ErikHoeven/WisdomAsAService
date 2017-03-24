/**
 * Created by erik on 3/24/17.
 */

function createTrainingSet(divButton){
    $('#'+ divButton).click(function () {

        $.ajax({
            url: '/BusinessRules/BuildSentimentModel',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({message: 'BuildSentiment'}),
            success: function (response) {
                console.info(response)
            }
        });



    })

}
