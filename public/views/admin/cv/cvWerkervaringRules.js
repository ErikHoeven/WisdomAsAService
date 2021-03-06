
function startCVWerkervaring(id) {
    console.info('Start werkervaring!!')

    $.ajax({
        url: '/admin/getWerkervaring',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id : id }),
        success: function (response) {
            console.info('Response Werkervaring:')
            console.info(response)

            var changeHitWerkervaringNummer
            var cv = response.cv
            var id = response.cv._id
            console.info(cv)
            var werkervaringArrayCount = 0
            var werkervaringRoleHit = 0
            var werkervaringArray = []
            var werkervaringen = response.cv.werkervaring
            var cvWizzard = addCVWizzard()


            if(werkervaringen){
                console.info(id)
                var werkervaring = response.cv.werkervaring[0]
                var frmaddCVWerkervaring = addCVWerkervaring(werkervaring)
                var werkervaringArray = werkervaringen
                var werkervaringTBL = tblWerkervaring(werkervaringArray, id)

            }
            else {
                var frmaddCVWerkervaring = addCVWerkervaring()
            }

            $('#contentElement').html(cvWizzard + frmaddCVWerkervaring )

            $('#Personalia').click(function () {
                console.info('Personalia')
                addCVPeronaliaForm(cv)
            })

            $('#Profiel').click(function () {
                console.info('Profiel')
                startCVProfiel(cv,user,id)
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
            })

            $('#txtdateDatumVan').datepicker()
            $('#txtDatumTot').datepicker()
            $('#tblWerkErvaring').html(werkervaringTBL)
            $('#Profiel').removeClass()
            $('#Werkervaring').addClass('active')


            $('#addWerkervaring').click(function () {
                console.info('addWerkervaring')
                // Werkervaring bestaat in de sessie
                if(werkervaringArray){
                    werkervaringArrayCount = werkervaringArray.length
                    werkervaringArray = addWerkervaring(werkervaringArrayCount,werkervaringRoleHit, werkervaringArray, changeHitWerkervaringNummer, id)
                }
                // Werkervaring bestaat niet in de sessie
                else{
                    console.info('Werkervaring onbekend')
                    console.info(id)
                    // Haal CV op in de database
                    $.ajax({
                        url: '/admin/getWerkervaring',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({id : id }),
                        success: function (response) {
                            console.info('Response Werkervaring:')
                            // Bestaat werkervaring in de CV
                            if (response.cv.werkervaring) {
                                werkervaringArray = response.cv.werkervaring
                                werkervaringArrayCount = werkervaringArray.length
                                werkervaringArray = addWerkervaring(werkervaringArrayCount, werkervaringRoleHit, werkervaringArray, changeHitWerkervaringNummer, id)
                            }
                            else {
                                // Bestaat niet in de CV
                            }
                        }})
                }
            })

            $('#saveWerkervaring').click(function () {
                console.info('saveWerkervaring: ' + id)
                startCVWerkervaring(id)

            })
        }
    })
}


function addCVWerkervaring(werkervaring) {

    if(!werkervaring){
        var formWerkervaring =
            '<div class="tab-pane active fade in" id="tab3"> ' +
            '<div class="row margin-bottom-10" id="frmWerkervaring"> ' +
            '<div class="col-md-6"> ' +
            '<div class="row"> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Functienaam">Functienaam</label> ' +
            '<input type="text" class="form-control" name="txtFunctienaam" id="txtFunctienaam" placeholder="Functienaam"> ' +
            '</div> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Bedrijf">Bedrijf</label> ' +
            '<input type="text" class="form-control" name="txtBedrijf" id="txtBedrijf" placeholder="Bedrijf"> ' +
            '</div> ' +
            '<div class="form-group col-md-12"> ' +
            '<label for="van">Van</label> ' +
            '<input type="text" class="form-control" name="txtDatumVan" id="txtdateDatumVan" placeholder="Datum van"> ' +
            '</div> <div class="form-group col-md-12"> ' +
            '<label for="tot">tot</label> ' +
            '<input type="text" class="form-control" name="txtDatumTot" id="txtDatumTot" placeholder="Datum tot"> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '<div class="col-md-6"> ' +
            '<h3>Werkervaring</h3> ' +
            '<p><div id="tblWerkErvaring"></div></p> </div> </div> </div>'

        var next =  '<div id="cmdWerkervaring"></div><a href="#" class="btn btn-default" id="addWerkervaring">Toevoegen Werkervaring <i class="fa fa-long-arrow-right"></i></a></div>'

        return formWerkervaring + next
    }
    else{
        var formWerkervaring =
            '<div class="tab-pane active fade in" id="tab3"> ' +
            '<div class="row margin-bottom-10" id="frmWerkervaring"> ' +
            '<div class="col-md-6"> ' +
            '<div class="row"> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Functienaam">Functienaam</label> ' +
            '<input type="text" class="form-control" name="txtFunctienaam" id="txtFunctienaam" value="' + werkervaring.functienaam+'"> ' +
            '</div> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Bedrijf">Bedrijf</label> ' +
            '<input type="text" class="form-control" name="txtBedrijf" id="txtBedrijf" value="' + werkervaring.bedrijf+'"> ' +
            '</div> ' +
            '<div class="form-group col-md-12"> ' +
            '<label for="van">van</label> ' +
            '<input type="text" class="form-control" name="txtDatumVan" id="txtdateDatumVan" value="' + werkervaring.van+'"> ' +
            '</div> <div class="form-group col-md-12"> ' +
            '<label for="tot">tot</label> ' +
            '<input type="text" class="form-control" name="txtDatumTot" id="txtDatumTot" value="' + werkervaring.tot+'"> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '<div class="col-md-6"> ' +
            '<h3>Werkervaring</h3> ' +
            '<p><div id="tblWerkErvaring"></div></p> </div> </div> </div>'

        var next =  '<div class="col-md-4"><a href="#" class="btn btn-default" id="updatedWerkervaring">Wijzigen Werkervaring <i class="fa fa-long-arrow-right"></i></a></div>' +
                    '<div class="col-md-4" align="right"><a href="#" class="btn btn-default" id="addWerkervaring">Toevoegen Werkervaring <i class="fa fa-long-arrow-right"></i></a></div>' +
                    '<div class="col-md-4" align="right"><a href="#" class="btn btn-default" id="saveWerkervaring">Volgende <i class="fa fa-long-arrow-right"></i></a></div>'

        return formWerkervaring + next
    }
}


function buildWerkErvaringArray(newBedrijf, currentArray, werkervaringObject) {
    var newWerkervaringArray = [], roleHit = 0

    //Check if value exist in Array
    currentArray.forEach(function (r) {
        if(newBedrijf == r.bedrijf){
            roleHit = 1
        }
        if(newBedrijf != r.bedrijf){
            roleHit = 0
        }
    })

    //If value not exist then add object to the array
    if(roleHit == 0){
        newWerkervaringArray = currentArray
        newWerkervaringArray.push(werkervaringObject)
    }

    // Else keep the array the same
    else{
        newWerkervaringArray = currentArray
    }

    return newWerkervaringArray
}


function tblWerkervaring(werkervaringArray, id) {
    var  tblHeader ='<theader><th>Functienaam</th><th>Bedrijf</th><th>van</th><th>tot</th></theader>'
        ,tblBody = '<tbody>'
        ,table = '<table id="roleTable" class="table table-hover">'

        for (var i = 0; i < werkervaringArray.length; i++) {
            tblBody = tblBody +
                '<tr>' +
                '<td id="' + i + '">' + werkervaringArray[i].functienaam + '</td>' +
                '<td id="' + i + '">' + werkervaringArray[i].bedrijf + '</td>' +
                '<td id="' + i + '">' + werkervaringArray[i].van + '</td>' +
                '<td id="' + i + '">' + werkervaringArray[i].tot + '</td>' +
                '<td id="cmd'+ i + '"><button type="button" class="btn btn-default btn-sm" onclick="updateFieldWerkervaring(\'' + id + '\',\'' + i +'\')"><span id="span"'+ i +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                '<td id="del' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="removeWerkervaring(\'' + id + '\',\'' + i +'\')"><span id="span"' + i + ' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                '</tr>'
        }

    return table = table + tblHeader + tblBody
}

function addWerkervaring(werkervaringArrayCount,werkervaringHit, werkervaringArray, changeHitWerkervaringNummer, id) {
    console.info('saveWerkervaring: ' + werkervaringArrayCount + ' :  ' + werkervaringHit )
    // Er bestaat werkervaring
    if(werkervaringArrayCount > 0 ){
        for(var i = 0;  i < werkervaringArrayCount;i++){
            werkervaringArray[i].nr = i
        }
        var  functienaam =  $('#txtFunctienaam').val()
            ,bedrijf =      $('#txtBedrijf').val()
            ,van =          $('#txtdateDatumVan').val()
            ,tot =          $('#txtDatumTot').val()
            ,werkervaringObject = {nr:  werkervaringArrayCount -1 , functienaam:functienaam, bedrijf:bedrijf, van: van, tot: tot}
    }
    // Er bestaat geen werkervaring
    else{
        var  functienaam =  $('#txtFunctienaam').val()
            ,bedrijf =      $('#txtBedrijf').val()
            ,van =          $('#txtdateDatumVan').val()
            ,tot =          $('#txtDatumTot').val()
            ,werkervaringObject = {nr:  1 , functienaam:functienaam, bedrijf:bedrijf, van: van, tot: tot}
    }

        werkervaringArray.push(werkervaringObject)
        //werkervaringArray = buildWerkErvaringArray(bedrijf,werkervaringArray,werkervaringObject)
        //console.info(werkervaringArray)

        var werkervaringTBL = tblWerkervaring(werkervaringArray, id)
        $('#tblWerkErvaring').html(werkervaringTBL)

        $.ajax({
            url: '/admin/saveWerkervaring',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({werkervaring: werkervaringArray, id : id }),
            success: function (response) {
                console.info(response)

                return werkervaringArray
            }
        })
}

//Specific functions
function updateFieldWerkervaring(id, rowid) {
    console.info('updateWerkervaring')
    console.info(id)
    $.ajax({
        url: '/admin/getWerkervaring',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id : id }),
        success: function (response) {
            var werkervaring = response.cv.werkervaring[rowid]
            var werkervaringen = response.cv.werkervaring

            $('#txtFunctienaam').val(werkervaring.functienaam)
            $('#txtBedrijf').val(werkervaring.bedrijf)
            $('#txtdateDatumVan').val(werkervaring.van)
            $('#txtDatumTot').val(werkervaring.tot)

            $('#cmdWerkervaring').html('')
            $('#cmdWerkervaring').html('<a href="#" class="btn btn-default" id="updatedWerkervaring">Wijzigen Werkervaring <i class="fa fa-long-arrow-right"></i></a>')

            $('#updatedWerkervaring').click(function () {

                var  functienaam =  $('#txtFunctienaam').val()
                    ,bedrijf =      $('#txtBedrijf').val()
                    ,van =          $('#txtdateDatumVan').val()
                    ,tot =          $('#txtDatumTot').val()

                werkervaringen[rowid].functienaam = functienaam
                werkervaringen[rowid].bedrijf = bedrijf
                werkervaringen[rowid].van = van
                werkervaringen[rowid].tot = tot

                $.ajax({
                    url: '/admin/saveWerkervaring',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({werkervaring: werkervaringen, id : id }),
                    success: function (response) {
                        console.info(response)

                        $.ajax({
                            url: '/admin/getWerkervaring',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({id : id }),
                            success: function (response) {
                                var tblWerkErv = tblWerkervaring(response.cv.werkervaring, id)
                                $('#tblWerkErvaring').html(tblWerkErv)

                            }
                        })
                    }
                })
            })
        }
    })
}
function  removeWerkervaring(id,row) {
    console.info('removeWerkervaring')
    console.info(id)
    console.info(row)
    $.ajax({
        url: '/admin/removeWerkervaring',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id, row: row}),
        success: function (response) {
            console.info(response.cv[0])
            console.info(response.cv[0]._id)
            startCVWerkervaring(response.cv[0]._id)
        }
    })
}
