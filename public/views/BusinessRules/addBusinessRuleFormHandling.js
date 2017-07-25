/**
 * Created by erik on 7/16/17.
 */

$(document).ready(function() {
    // (1) Start situation
    $('#Kleurbepaler').hide();
    $('#zoekwaarde').show();
    $('#score').hide();
    $('#Cattegorie').hide();
    $('#CattegorieValue').hide();
    $('#Simulatie').hide();
    $('#Scraping').hide();
    $('#KamervanKoophandel').hide();
    $('#Dictionary').hide();
    $('#txtWoord').hide();
    $('#lstWoordvorm').hide()


    console.info('document geladen');
    var lstCatValues = [];
    var lstParValues = [];

    // (2) listbox Change hide & show input fields
    $('#lstTypeBusinessRule').change(function () {

        if ($('#lstTypeBusinessRule option:selected').text() == 'Cattegorie') {
            $('#zoekwaarde').hide();
            $('#score').hide();
            $('#Cattegorie').show();
            $('#Kleurbepaler').show();
            $('#CattegorieValue').show();
            $('#Simulatie').hide();
            $('#Scraping').hide();
            $('#KamervanKoophandel').hide();
            $('#Dictionary').hide();


        }
        if ($('#lstTypeBusinessRule option:selected').text() == 'Zoekwaarde') {
            $('#Kleurbepaler').hide();
            $('#zoekwaarde').show();
            $('#score').hide();
            $('#Cattegorie').hide();
            $('#CattegorieValue').hide();
            $('#Simulatie').hide();
            $('#lstSimAantalFormulieren').hide();
            $('#Scraping').hide();
            $('#KamervanKoophandel').hide();
            $('#Dictionary').hide();

        }
        if ($('#lstTypeBusinessRule option:selected').text() == 'Score') {
            $('#Kleurbepaler').hide();
            $('#zoekwaarde').show();
            $('#score').show();
            $('#Cattegorie').hide();
            $('#CattegorieValue').hide();
            $('#Simulatie').hide();
            $('#lstSimAantalFormulieren').hide();
            $('#Scraping').hide();
            $('#KamervanKoophandel').hide();
            $('#Dictionary').hide();

        }
        if ($('#lstTypeBusinessRule option:selected').text() == 'Google zoekwaarde') {
            $('#Kleurbepaler').hide();
            $('#zoekwaarde').show();
            $('#score').hide();
            $('#Cattegorie').hide();
            $('#CattegorieValue').hide();
            $('#Simulatie').hide();
            $('#lstSimAantalFormulieren').hide();
            $('#Scraping').hide();
            $('#KamervanKoophandel').hide();
            $('#Dictionary').hide();

        }

        if ($('#lstTypeBusinessRule option:selected').text() == 'Simulatie') {
            $('#Kleurbepaler').hide();
            $('#zoekwaarde').hide();
            $('#score').hide();
            $('#Cattegorie').hide();
            $('#CattegorieValue').hide();
            $('#Simulatie').show();
            $('#Scraping').hide();
            $('#KamervanKoophandel').hide();
            $('#Dictionary').hide();
            $('#Upload').hide();

            var formFields = getSimFormFields()

        }

        if ($('#lstTypeBusinessRule option:selected').text() == 'Kamer van Koophandel') {
            $('#Kleurbepaler').hide();
            $('#zoekwaarde').hide();
            $('#score').hide();
            $('#Cattegorie').hide();
            $('#CattegorieValue').hide();
            $('#Simulatie').hide();
            $('#lstSimAantalFormulieren').hide();
            $('#Scraping').hide();
            $('#KamervanKoophandel').show();
            $('#Dictionary').hide();
            $('#Upload').hide();
        }

        if ($('#lstTypeBusinessRule option:selected').text() == 'Dictionary') {
            $('#Kleurbepaler').hide();
            $('#zoekwaarde').hide();
            $('#score').hide();
            $('#Cattegorie').hide();
            $('#CattegorieValue').hide();
            $('#Simulatie').hide();
            $('#lstSimAantalFormulieren').hide();
            $('#Scraping').hide();
            $('#KamervanKoophandel').hide();
            $('#Dictionary').show();
            $('#Upload').hide();
        }

        if ($('#lstTypeBusinessRule option:selected').text() == 'BuildGraph') {
            $('#Kleurbepaler').hide();
            $('#zoekwaarde').hide();
            $('#score').hide();
            $('#Cattegorie').hide();
            $('#CattegorieValue').hide();
            $('#Simulatie').hide();
            $('#lstSimAantalFormulieren').hide();
            $('#Scraping').hide();
            $('#KamervanKoophandel').hide();
            $('#Dictionary').hide();
            $('#Upload').hide();
        }

        if ($('#lstTypeBusinessRule option:selected').text() == 'Upload') {
            $('#Kleurbepaler').hide();
            $('#zoekwaarde').hide();
            $('#score').hide();
            $('#Cattegorie').hide();
            $('#CattegorieValue').hide();
            $('#Simulatie').hide();
            $('#lstSimAantalFormulieren').hide();
            $('#Scraping').hide();
            $('#KamervanKoophandel').hide();
            $('#Dictionary').hide();
            $('#Upload').show();
        }

    });

    $('#lstActie').change(function () {
        if ($('#lstActie option:selected').text() == 'Zoeken') {
            $('#txtWoord').hide();
            $('#lstWoordvorm').hide()
        }

        if ($('#lstActie option:selected').text() == 'handmatig toevoegen') {
            $('#txtWoord').show();
            $('#lstWoordvorm').show();
        }
    })


    // (3) Add value to array
    $('#cmdAddCatValue').click(function () {
        lstCatValues.push($('#CatValue').val());
        $('#CatValue').val('');


        //START TABLE
        catValueHTML = '<p><table class="table table-sm"><th>Cattegorie waarde:</th>';


        for (var i = 0; i < lstCatValues.length; i++) {
            catValueHTML = catValueHTML + '<tr><td>' + lstCatValues[i] + '</td></tr>'
        }

        catValueHTML = catValueHTML + '</tabel>'

        //END TABLE

        //START HIDDEN FIELD
        catValueHTML = catValueHTML + '<input type="hidden" id="catValue" name="catValue" value=' + JSON.stringify(lstCatValues) + '></input>'


        $('#catvaluelist').html(catValueHTML)
    });
    // (4)Clear array from step 3
    $('#clearCatValue').click(function () {
        lstCatValues = [];
        $('#catvaluelist').html('');
        $('#CatValue').val('');

    });
    var teller = 0;
    //
    $('#kleur').focusout(function () {
        teller = teller + 1;
        console.info(teller)
        if (teller == 1) {
            datasetvb = [];
            datasetvb.push({
                color: "#" + $(this).val()
                , label: $('#txtTagCattegory').val()
                , value: 50
            });

            datasetvb.push({
                color: "#333333"
                , label: "Overige"
                , value: 100
            });
            console.info(datasetvb);
        }
    });


    $('#lstActie').change(function () {
        var valueListActie = $('#lstActie option:selected').text()
        console.info(valueListActie)
        if (valueListActie == 'Zoeken bijvoegelijknaamwoorden') {
            $('#divCmdToevoegenBusinessRules').html('<button type="button" id="addBijvoegelijknaamwoorden" class="btn btn-primary">toevoegen Bijvoegelijknaamwoorden</button>')
            $('#addBijvoegelijknaamwoorden').click(function () {
                console.info('Toevoegen bijvoegelijknaamwoorden')
                $.ajax({
                    url: '/BusinessRules/sentiment',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({message: 'Toevoegen woorden'}),
                    success: function (response) {
                        console.info(response)
                        //createGeneric(response, 'tblBusinessrules', 'trainingSet', 1, 'score', '_id', 'Training set for Sentiment Model')
                        //$('#trainingSetOptions').html('')
                        //$('#btnSentiment').html('<button type="button" id="cmdBuildModel" class="btn btn-primary">Build Sentiment Model</button>')
                    }
                });
            })
        }
    })

})