/**
 * Created by erik on 3/24/18.
 */

 // A. change menu to red and the rest blue.
function selectSentimentMenu() {
    console.info('setMenu')
    $('#search').removeClass()
    $('#home').removeClass()
    $('#category').removeClass()
    $('#sentiment').addClass('active-menu')
    $('#dictionary').removeClass()
    $('#employee').removeClass()
    $('#content').removeClass()
    $('#blog').removeClass()
}

// B. Change title and subtitle
function setSentimentTitle() {
    console.info('setTitle')
    $('#title').html('Sentiment instellingen')
    $('#subtitle').html('Vul hier de sentiment score in (-5 het meest negatief en 5 het meest positief')
}

// C. Get Sentiment results from MongoDB if no results are available show form
function getSentimentResults(user) {

    //1. Form search for word
    $('#contentElement').html(
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<h4 style="margin-bottom: 25px; text-align: left">Zoeken sentiment woorden</h4>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<input type="text" class="form-control" id="txtSearchWord" name="txtSearchWord" placeholder="zoekterm">' +
        '</div>' +
        '<div class="col-md-5">' +
        '<button type="button" class="btn btn-primary btn-flat btn-raised btn-float" id="cmdWoordForm"><span class="fa fa-plus"></span></button>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-12">' +
        '<div id="tblSentimentResults">' +
        '</div>' +
        '</div>'
    )

    // 2. Search on term
    $("#txtSearchWord").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/admin/getSentimentResults',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({term: request.term}),
                success: function (response) {
                    //3 Show results
                    $('#tblSentimentResults').html('')
                    var table = '<table class="table table-hover">' + response.header + response.body + '</table>'
                    $('#tblSentimentResults').html(table)

                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            log("Selected: " + ui.item.value + " aka " + ui.item.id);
        }
    });

    //3. add Sentiment form results when press + button
    $('#cmdWoordForm').click(function () {
        var form = '<div class="row">'+
            '<div class="col-md-6">'+
            '<div class="c_panel">' +
            '<div class="clearfix"></div>' +
            '</div><!--/.c_title-->' +
            '<div class="c_content">' +
            '<div class="form-group">' +
                '<label for="Woord">Woord</label>' +
                '<input type="text" class="form-control" id="txtWoord" placeholder="woord">' +
            '</div>'+
            '<div class="form-group">'+
                '<select id="selScore">' +
                    '<option value="-5">-5</option>' +
                    '<option value="-4">-4</option>' +
                    '<option value="-3">-3</option>' +
                    '<option value="-2">-2</option>' +
                    '<option value="-1">-1</option>' +
                    '<option value="0">0</option>' +
                    '<option value="1">1</option>' +
                    '<option value="2">2</option>' +
                    '<option value="3">3</option>' +
                    '<option value="4">4</option>' +
                    '<option value="5">5</option>' +
                '</select>' +
            '</div> ' +
            '<div>' +
                '<button class="btn btn-primary btn-flat" id="cmdAddWoord">Opslaan</button>' +
            '</div>' +
        '</div>' +
        '</div>'
        '</div>'
        '</div>'

        $('#contentElement').html(form)

        $('#cmdAddWoord').click(function () {
            console.info('cmdAddWoord')

            var word = $('#txtWoord').val()
            var score = $('#selScore option:selected').text()

            addSentimentResults(word, score, user)
        })
    })
}
// 2.A. Update row to editable fields
function updateSentimentField(id, woord, score){
    var option = '<select id="editScore'+ id + '">' +
        '<option value="-5">-5</option>' +
        '<option value="-4">-4</option>' +
        '<option value="-3">-3</option>' +
        '<option value="-2">-2</option>' +
        '<option value="-1">-1</option>' +
        '<option value="0">0</option>' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        '<option value="4">4</option>' +
        '<option value="5">5</option>' +
        '</select>'

    $('#lookupValue' + id).html('<input type="text" id="editlookupValue' + id +'" placeholder="'+ woord +'"></input>')
    $('#score' + id).html(option)

    var newWoord = $('#editWoord' + id).val()
    var newScore = $('#editScore' + id +' option:selected').text()

    $('#edit' + id).html('')
    $('#edit' + id).append('<button id="cmd'+ id+'" type="button" class="btn btn-default btn-sm" onclick="updateSentimentValue(\'' + id + '\')"><span class="glyphicon glyphicon-save"></span> Edit</button>')
}

  function addSentimentResults(word, score, user) {
     $.ajax({
         url: '/admin/addSentimentResults',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({lookupValue: word, score: score, user: user}),
         success: function (response) {
             console.info(response)
             getSentimentResults(user)
         }
     })
 }



 function updateSentimentValue (id) {
     var  woord = $('#editlookupValue' + id).val()
         ,score = $('#editScore' + id +' option:selected').text()

     var sentimentObject = {
         "lookupValue": woord,
         "score": score,
         "id": id
     }

     console.info(sentimentObject)

*    $.ajax({
         url: '/admin/editSentimentResults',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(sentimentObject),
         success: function (response) {
            console.info(response)
             getSentimentResults(user)
     }})
}


function removeSentimentValue(id) {
     $.ajax({
     url: '/admin/removeSentimentResults',
     type: 'POST',
     contentType: 'application/json',
     data: JSON.stringify({id: id}),
     success: function (response) {
     console.info(response)
     getSentimentResults(user)
    }
})}





