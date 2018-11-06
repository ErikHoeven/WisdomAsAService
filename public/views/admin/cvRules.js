/**
 * Created by erik on 4/9/18.
 */
function selectCVMenu() {
    console.info('setMenu')
    $('#search').removeClass()
    $('#home').removeClass()
    $('#category').removeClass()
    $('#sentiment').removeClass()
    $('#dictionary').removeClass()
    $('#employee').removeClass()
    $('#content').removeClass()
    $('#blog').removeClass()
    $('#cvBuilder').addClass('active-menu')
}

// B. Change title and subtitle
function setCVitle() {
    $('#title').html('CV Beheren')
    $('#subtitle').html('Zoek je CV en beheer')
}

// C. Get Search results from MongoDB if no results are available show form
function getCVS(user) {

    //1. Form search for word
    $('#contentElement').html(
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<h4 style="margin-bottom: 25px; text-align: left">Zoeken CV</h4>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<input type="text" class="form-control" id="txtSearchWord" name="txtSearchWord" placeholder="zoekterm">' +
        '</div>' +
        '<div class="col-md-5">' +
        '<button type="button" class="btn btn-primary btn-flat btn-raised btn-float" id="cmdSearchForm"><span class="fa fa-plus"></span></button>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-12">' +
        '<div id="tblContentResults">' +
        '</div>' +
        '</div>'
    )

    // 2. Search on term
    $("#txtSearchWord").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/admin/getCVS',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({term: request.term}),
                success: function (response) {
                    console.info(response)
                    //3 Show results
                    $('#tblContentResults').html('')
                    var table = '<table class="table table-hover">' + response.header + response.body + '</table>'
                    $('#tblContentResults').html(table)
                }
            })
        },
        minLength: 2,
        select: function (event, ui) {
            log("Selected: " + ui.item.value + " aka " + ui.item.id);
        }
    })

    //3. add Personalia when press + button
    $('#cmdSearchForm').click(function () {
        console.info('cmdSearchForm')
        var cvWizzard =  addCVWizzard()
        var formPersonalia = addCVPeronaliaForm()


        $('#contentElement').html(cvWizzard + formPersonalia)


        $('#savePersonalia').click(function () {
            var voornaam  = $('#txtVoornaam').val()
            var achternaam = $('#txtAchternaam').val()
            var titel =  $('#txtTitel').val()
            var woonplaats =  $('#txtWoonplaats').val()

            $.ajax({
                url: '/admin/saveCVPeronalia',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({voornaam: voornaam, achternaam: achternaam, titel:titel, woonplaats:woonplaats }),
                success: function (response) {
                    console.info(response)

                    $.ajax({
                        url: '/admin/getCV',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({voornaam: voornaam, achternaam: achternaam}),
                        success: function (response) {
                            console.info(response)
                            var cv = response.cv[0]
                            var id = response.cv[0].id
                            startCVProfiel(cv,user, id)
                        }
                    })
                }
            })
        })
        //3.A. Navigate to profile
    })
}

//4. Update field for personalia
function updateField(id) {
    $.ajax({
        url: '/admin/getPeronalia',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id }),
        success: function (response) {
            console.info('GET CV')
            var cv = response.cv[0]
            console.info(cv)
            var cvWizzard =  addCVWizzard()
            var formPersonalia = addCVPeronaliaForm(cv)

            $('#contentElement').html(cvWizzard + formPersonalia)


            $('#Personalia').click(function () {
                console.info('Personalia')
                addCVPeronaliaForm(cv)
            })

            $('#Profiel').click(function () {
                console.info('Profiel')
                console.info(cv)
                console.info(user)
                console.info(id)
                startCVProfiel(cv, user, id)
            })

            $('#Werkervaring').click(function () {
                console.info('Werkervaring')
                startCVWerkervaring(id)
            })

            $('#Opleiding').click(function () {
                console.info('Opleiding')
                startCVOpleiding(id)
            })

            $('#Vaardigheden').click(function () {
                console.info('Vaardigheden')
                startCVVaardigheden(id)
            })

            $('#updatePersonalia').click(function () {
                var voornaam  = $('#txtVoornaam').val()
                var achternaam = $('#txtAchternaam').val()
                var titel =  $('#txtTitel').val()
                var woonplaats =  $('#txtWoonplaats').val()

                $.ajax({
                    url: '/admin/updateCVPeronalia',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({voornaam: voornaam, achternaam: achternaam, titel:titel, woonplaats:woonplaats, id:id }),
                    success: function (response) {
                        startCVProfiel(null,null,id)
                }})
        })
    }})
}

// Specific functions
function addCVWizzard() {
    var header = '<h5 class="head-style-1"><span class="head-text-green"><strong>CV aanmaken</strong></span></h5>'

    var menu =
        '<div id="wizard1">' +
        '<ul class="nav nav-tabs" role="tablist">' +
        '<li id="Personalia" role="presentation" class="active"> ' +
        '<a href="#tab1" data-toggle="tab"> ' +
        'Persoons gegevens ' +
        '</a> ' +
        '</li> ' +
        '<li id="Profiel1" role="presentation"> ' +
        '<a  id="Profiel" href="#tab2" data-toggle="tab"> ' +
        ' Profiel ' +
        '</a> ' +
        '</li> ' +
        '<li id="Werkervaring" role="presentation"> ' +
        '<a href="#tab3" data-toggle="tab"> ' +
        'Werkervaring' +
        '</a> ' +
        '</li> ' +
        '<li id="Opleiding" role="presentation"> ' +
        '<a href="#tab4" data-toggle="tab"> ' +
        'Opleiding' +
        '</a> ' +
        '</li> ' +
        '<li id="Vaardigheden" role="Vaardigheden"> ' +
        '<a href="#tab5" data-toggle="tab"> ' +
        'Vaardigheden' +
        '</a> ' +
        '</li> ' +
        '<li id="Talen" role="Vaardigheden"> ' +
        '<a href="#tab6" data-toggle="tab"> ' +
        'Talen' +
        '</a> ' +
        '</li> ' +
        '<li id="DetailsWerkervaring" role="DetailsWerkervaring"> ' +
        '<a href="#tab7" data-toggle="tab"> ' +
        'Details werkervaring' +
        '</a> ' +
        '</li> ' +
        '<li id="Finish" role="presentation"> ' +
        '<a href="#tab68 data-toggle="tab"> ' +
        'Finish </a> ' +
        '</li> ' +
        '</ul>'

    var progressbar =
        '<div id="progressbarContainer" class="progress progress-sm m-t-sm margin-top-15">' +
        '<div id="progressBar" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 16%;"></div>' +
        '</div>'


    var form =
        '<form id="wizardForm1" class="validator" novalidate="novalidate"> ' +
        '<div id="content" class="tab-content"> '

    return menu + form + progressbar

}

function removeValue(id) {

    console.info(id)
    $.ajax({
        url: '/admin/removeCV',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({nr:id }),
        success: function (response) {
            getCVS(user)
        }})

}