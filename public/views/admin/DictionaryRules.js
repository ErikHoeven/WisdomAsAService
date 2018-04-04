/**
 * Created by erik on 3/24/18.
 */

 // A. change menu Dictionario to red and the rest blue.
function selectDictionaryMenu() {
    console.info('setMenu')
    $('#search').removeClass()
    $('#home').removeClass()
    $('#category').removeClass()
    $('#sentiment').removeClass()
    $('#dictionary').addClass('active-menu')
    $('#employee').removeClass()
    $('#content').removeClass()
    $('#blog').removeClass()
}

// B. Change title and subtitle
function setDictionaryTitle() {
    console.info('setTitle')
    $('#title').html('Woordenboek instellingen')
    $('#subtitle').html('Voeg hier de ontbrekende woorden toe')
}

// C. Get Search results from MongoDB if no results are available show form
function getDictionaryResults(user) {

    //1. Form search for word
    $('#contentElement').html(
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<h4 style="margin-bottom: 25px; text-align: left">Zoeken woorden</h4>' +
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
        '<div id="tblDictionaryResults">' +
        '</div>' +
        '</div>'
    )

    // 2. Search on term
    $("#txtSearchWord").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/admin/getDictionaryResults',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({term: request.term}),
                success: function (response) {
                    //3 Show results
                    $('#tblDictionaryResults').html('')
                    var table = '<table class="table table-hover">' + response.header + response.body + '</table>'
                    $('#tblDictionaryResults').html(table)
                    selectDictionaryMenu()
                    setDictionaryTitle()
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            log("Selected: " + ui.item.value + " aka " + ui.item.id);
        }
    });

    //3. add Dictionary form results when press + button
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
                '<select id="selTypeWoord">' +
                    '<option value="ZelfstandigNaamWoord">ZelfstandigNaamWoord</option>' +
                    '<option value="BijvoegelijkNaamWoord">BijvoegelijkNaamWoord</option>' +
                    '<option value="Volledig werkwoord">Volledig werkwoord</option>' +
                    '<option value="Verledentijd">Verledentijd</option>' +
                    '<option value="VoltooidDeelWoord">VoltooidDeelWoord</option>' +
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
            var typeWord = $('#selTypeWoord option:selected').text()

            addDictionaryResults(word, typeWord, user)
        })
    })
}
// 2.A. Update row to editable fields
function updateDictionaryField(id, woord, volledigWerkwoord, werkwoordInVerledentijd, voltooiddeelwoord, typeWoord, volgLetter){
    var option = '<select id="selTypeWoord">' +
    '<option value="ZelfstandigNaamWoord">ZelfstandigNaamWoord</option>' +
    '<option value="BijvoegelijkNaamWoord">BijvoegelijkNaamWoord</option>' +
    '<option value="Volledig werkwoord">Volledig werkwoord</option>' +
    '<option value="Verledentijd">Verledentijd</option>' +
    '<option value="VoltooidDeelWoord">VoltooidDeelWoord</option>' +
    '</select>'


    $('#woord' + id).html('<input type="text" id="editWoord' + id +'" placeholder="'+ woord +'"></input>')
    $('#volledigWerkwoord' + id).html('<input type="text" id="editVolledigWerkwoord' + id +'" placeholder="'+ volledigWerkwoord +'"></input>')
    $('#werkwoordInVerledentijd' + id).html('<input type="text" id="editWerkwoordInVerledentijd' + id +'" placeholder="'+ werkwoordInVerledentijd +'"></input>')
    $('#voltooiddeelwoord' + id).html('<input type="text" id="editVoltooiddeelwoord' + id +'" placeholder="'+ voltooiddeelwoord +'"></input>')
    $('#typeWoord' + id).html(option)
    $('#volgLetter' + id).html('<input type="text" id="editVolgLetter' + id +'" placeholder="'+ volgLetter +'"></input>')

    var newWoord = $('#editWoord' + id).val()
    var newVolledigWerkwoord = $('#editVolledigWerkwoord' + id).val()
    var newWerkwoordInVerledentijd = $('#editWerkwoordInVerledentijd' + id).val()
    var newVoltooiddeelwoord = $('#editVoltooiddeelwoord' + id).val()
    var newTypeWoord = $('#selTypeWoord option:selected').text()
    var newvolgLetter = $('#editVolgLetter' + id).val()

    $('#edit' + id).html('')
    $('#edit' + id).append('<button id="cmd'+ id+'" type="button" class="btn btn-default btn-sm" onclick="updateDictionaryValue(\'' + id + '\')"><span class="glyphicon glyphicon-save"></span> Edit</button>')
}

  function addDictionaryResults(word, typeWord, user) {
     $.ajax({
         url: '/admin/addDictionaryResults',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({word: word, typeWord: typeWord, user: user}),
         success: function (response) {
             console.info(response)
             getDictionaryResults(user)
         }
     })
 }



 function updateDictionaryValue (id) {
     var woord = $('#editWoord' + id).val()
         , volledigWerkwoord = $('#editVolledigWerkwoord' + id).val()
         , werkwoordInVerledentijd = $('#editWerkwoordInVerledentijd' + id).val()
         , voltooiddeelwoord = $('#editVoltooiddeelwoord' + id).val()
         , typeWoord = $('#selTypeWoord option:selected').text()
         , volgLetter = $('#editVolgLetter' + id).val()

     var dictObject = {
         "volledigWerkwoord": volledigWerkwoord,
         "werkwoordInVerledentijd": werkwoordInVerledentijd,
         "voltooiddeelwoord": voltooiddeelwoord,
         "typeWoord": typeWoord,
         "woord": woord,
         "volgLetter": volgLetter,
         "URL": "handmatig",
         "id": id
     }

     console.info(dictObject)

*    $.ajax({
         url: '/admin/editDictionaryResults',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(dictObject),
         success: function (response) {
            console.info(response)
            getDictionaryResults(user)
     }})
}


function removeDictionaryValue(id) {
     $.ajax({
     url: '/admin/removeDictionaryResults',
     type: 'POST',
     contentType: 'application/json',
     data: JSON.stringify({id: id}),
     success: function (response) {
     console.info(response)
     getDictionaryResults(user)
    }
})}





