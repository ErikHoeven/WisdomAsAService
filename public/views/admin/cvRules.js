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
        '<h4 style="margin-bottom: 25px; text-align: left">Zoeken zoek cv</h4>' +
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

    //3. add Search Criteria form results when press + button
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
                    getSearchResults(user)
                }
            })
        })
    })
}

function updateField(id) {
    $.ajax({
        url: '/admin/getPeronalia',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id }),
        success: function (response) {
            var cv = response.cv[0]
            console.info(cv)
            var cvWizzard =  addCVWizzard()
            var formPersonalia = addCVPeronaliaForm(cv)

            $('#contentElement').html(cvWizzard + formPersonalia)

            $('#updatePersonalia').click(function () {
                var voornaam  = $('#txtVoornaam').val()
                var achternaam = $('#txtAchternaam').val()
                var titel =  $('#txtTitel').val()
                var woonplaats =  $('#txtWoonplaats').val()

                var brancheArray = []
                var roleArray = []

                var changeBrancheHit = 0
                var changeRoleHit = 0

                var brancheArrayCount = 0
                var roleArrayCount = 0

                var changeHitBracheNummer
                var changeHitRoleNummer



                $.ajax({
                    url: '/admin/updateCVPeronalia',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({voornaam: voornaam, achternaam: achternaam, titel:titel, woonplaats:woonplaats, id:id }),
                    success: function (response) {

                        //Profiel form
                        var profielBranche = formProfielBranche()
                        var profielRole = formProfielRole()

                        $('#contentElement').html(cvWizzard + profielBranche + '<p>' + profielRole )

                        $('#Personalia').removeClass()
                        $('#Profiel').addClass('active')
                        console.info('CV voor 149')
                        console.info(cv)

                        if( cv.roleProfiles ){
                            roleArray = cv.roleProfiles
                            var tableRole = tblRole(roleArray)
                            $('#tblRolErvaring').html(tableRole)


                        }
                        if( cv.brancheProfiles ){
                            brancheArray = cv.brancheProfiles
                            var tableBranche = tblBranche(brancheArray)
                            $('#tblBrancheErvaring').html(tableBranche)
                        }


                        CKEDITOR.replace('txtProfielBranche')
                        CKEDITOR.replace('txtRole')

                        //Profiel - Branche (add Branche )
                        $('#saveBrance').click(function () {
                            brancheArray = addBranche(brancheArrayCount,changeBrancheHit, brancheArray, changeHitBracheNummer)
                        })

                        //Profiel - Role (add Role )
                        $('#saveRole').click(function () {
                            roleArray = addRole(roleArrayCount,changeRoleHit, roleArray, changeHitRoleNummer)
                        })

                        //Profiel - Branche (change Branche )
                        $('#selBranche').change(function () {
                            var selBranche =  changeBrange(brancheArray, changeHitBracheNummer)
                            if(selBranche){
                                changeBrancheHit = selBranche.changeBrancheHit
                                changeHitBracheNummer = selBranche.changeHitBracheNummer
                            }
                        })

                        //Profiel - Role (change Role )
                        $('#selRole').change(function () {
                            var selRole = changeRole(roleArray,changeHitRoleNummer)
                            if(selRole){
                                changeRoleHit = selRole.changeRoleHit
                                changeHitRoleNummer = selRole.changeHitRoleNummer
                            }
                        })

                        //Save profile and next section
                        $('#saveProfile').click(function () {
                            saveProfiel(roleArray,brancheArray,id)
                        })
                    }
                })
            })
        }
    })
}


// Specific functions
function addCVWizzard() {
    var header = '<h5 class="head-style-1"><span class="head-text-green"><strong>CV aanmaken</strong></span></h5>'

    var menu =
        '<div id="wizard1">' +
        '<ul class="nav nav-tabs" role="tablist">' +
        '<li id="Personalia" role="presentation" class="active"> ' +
        '<a href="#tab1" data-toggle="tab"> ' +
        '<i class="fa fa-user m-r-xs"></i> Personal Info ' +
        '</a> ' +
        '</li> ' +
        '<li id="Profiel" role="presentation"> ' +
        '<a href="#tab2" data-toggle="tab"> ' +
        '<i class="fa fa-shopping-cart m-r-xs"></i> Profiel ' +
        '</a> ' +
        '</li> ' +
        '<li id="Werkervaring" role="presentation"> ' +
        '<a href="#tab3" data-toggle="tab"> ' +
        '<i class="fa fa-cc-visa m-r-xs">' +
        '</i> Werkervaring' +
        '</a> ' +
        '</li> ' +
        '<li id="Opleiding" role="presentation"> ' +
        '<a href="#tab4" data-toggle="tab"> ' +
        '<i class="fa fa-cc-visa m-r-xs">' +
        '</i> Opleiding' +
        '</a> ' +
        '</li> ' +
        '<li id="domeinkennis" role="domein kennis"> ' +
        '<a href="#tab5" data-toggle="tab"> ' +
        '<i class="fa fa-cc-visa m-r-xs">' +
        '</i> Vaardigheden' +
        '</a> ' +
        '</li> ' +
        '<li id="Finish" role="presentation"> ' +
        '<a href="#tab6" data-toggle="tab"> ' +
        '<i class="fa fa-check m-r-xs">' +
        '</i> Finish </a> ' +
        '</li> ' +
        '</ul>'

    var progressbar =
        '<div class="progress progress-sm m-t-sm margin-top-15">' +
        '<div id="progressBar" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 16%;"></div>' +
        '</div>'


    var form =
        '<form id="wizardForm1" class="validator" novalidate="novalidate"> ' +
        '<div id="content" class="tab-content"> '

    return menu + form + progressbar

}

function saveProfiel(roleProfiles, brancheProfiles, id) {

    $.ajax({
        url: '/admin/updateCVProfile',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({roleProfiles: roleProfiles, brancheProfiles: brancheProfiles, id : id }),
        success: function (response) {
            console.info(response)
            startCVWerkervaring(id)

        }
    })
}