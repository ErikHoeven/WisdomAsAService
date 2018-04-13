/**
 * Created by erik on 4/13/18.
 */
function startCVOpleiding(id) {
    $.ajax({
        url: '/admin/getOpleiding',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id : id }),
        success: function (response) {

            var changeHitOpleidingNummer
            var opleidingArrayCount = 0
            var opleidingHit = 0
            var opleidingArray = []
            var opleidingen = response.cv.opleiding
            var cvWizzard = addCVWizzard()

            if(opleidingen){
                console.info(id)
                var opleiding = response.cv.opleiding[0]
                var frmaddCVOpleiding = addCVOpleiding(opleiding)
                var opleidingArray = opleidingen
                var opleidingTBL = tblOpleiding(opleidingArray, id)
            }
            else {
                var frmaddCVOpleiding = addCVOpleiding()
            }

            $('#contentElement').html(cvWizzard + frmaddCVOpleiding )
            $('#txtdateDatumVan').datepicker()
            $('#txtDatumTot').datepicker()
            $('#tblOpleiding').html(opleidingTBL)
            $('#Werkervarin').removeClass()
            $('#Opleiding').addClass('active')


            $('#addOpleiding').click(function () {
                console.info('ID: ' + id )
                opleidingArray = addOpleiding(opleidingArrayCount,opleidingHit, opleidingArray, changeHitOpleidingNummer, id)
            })
        }
    })
}


function addCVOpleiding(opleiding) {

    if(!opleiding){
        var formOpleiding =
            '<div class="tab-pane active fade in" id="tab3"> ' +
            '<div class="row margin-bottom-10" id="frmOpleiding"> ' +
            '<div class="col-md-6"> ' +
            '<div class="row"> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Functienaam">Opleiding</label> ' +
            '<input type="text" class="form-control" name="txtOpleiding" id="txtOpleiding" placeholder="Opleiding"> ' +
            '</div> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Bedrijf">Instituut</label> ' +
            '<input type="text" class="form-control" name="txtInstituut" id="txtInstituut" placeholder="Instituut"> ' +
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
            '<h3>Opleiding</h3> ' +
            '<p><div id="tblOpleiding"></div></p> </div> </div> </div>'

        var next =  '<div id="cmdOpleiding"></div><a href="#" class="btn btn-default" id="addOpleiding">Toevoegen Opleiding <i class="fa fa-long-arrow-right"></i></a></div>'

        return formOpleiding + next
    }
    else{
        var formOpleiding =
            '<div class="tab-pane active fade in" id="tab3"> ' +
            '<div class="row margin-bottom-10" id="frmOpleiding"> ' +
            '<div class="col-md-6"> ' +
            '<div class="row"> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Functienaam">Opleiding</label> ' +
            '<input type="text" class="form-control" name="txtOpleiding" id="txtOpleiding" value="' + opleiding.opeiding+'"> ' +
            '</div> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Bedrijf">Instituut</label> ' +
            '<input type="text" class="form-control" name="txtInstituut" id="txtInstituut" value="' + opleiding.instituut+'"> ' +
            '</div> ' +
            '<div class="form-group col-md-12"> ' +
            '<label for="van">Titel</label> ' +
            '<input type="text" class="form-control" name="txtDatumVan" id="txtdateDatumVan" value="' + opleiding.van+'"> ' +
            '</div> <div class="form-group col-md-12"> ' +
            '<label for="tot">tot</label> ' +
            '<input type="text" class="form-control" name="txtDatumTot" id="txtDatumTot" value="' + opleiding.tot+'"> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '<div class="col-md-6"> ' +
            '<h3>Opleiding</h3> ' +
            '<p><div id="tblWerkErvaring"></div></p> </div> </div> </div>'

        var next =  '<div class="col-md-4"><a href="#" class="btn btn-default" id="updatedOpleiding">Wijzigen Opleiding <i class="fa fa-long-arrow-right"></i></a></div>' +
                    '<div class="col-md-4" align="right"><a href="#" class="btn btn-default" id="addOpleiding">Toevoegen Opleiding <i class="fa fa-long-arrow-right"></i></a></div>' +
                    '<div class="col-md-4" align="right"><a href="#" class="btn btn-default" id="saveOpleiding">Volgende <i class="fa fa-long-arrow-right"></i></a></div>'

        return formOpleiding + next
    }
}


function buildOpleidingArray(opleiding, currentArray, opleidingObject) {
    var newOpleidingArray = [], roleHit = 0

    //Check if value exist in Array
    currentArray.forEach(function (r) {
        if(opleiding == r.opleiding){
            roleHit = 1
        }
        if(opleiding != r.opleiding){
            roleHit = 0
        }
    })

    //If value not exist then add object to the array
    if(roleHit == 0){
        newOpleidingArray = currentArray
        newOpleidingArray.push(opleidingObject)
    }

    // Else keep the array the same
    else{
        newOpleidingArray = currentArray
    }

    return newOpleidingArray
}


function tblOpleiding(opleidingArray, id) {
    var  tblHeader ='<theader><th>Opleiding</th><th>Instituut</th><th>van</th><th>tot</th></theader>'
        ,tblBody = '<tbody>'
        ,table = '<table id="roleTable" class="table table-hover">'

        for (var i = 0; i < opleidingArray.length; i++) {
            tblBody = tblBody +
                '<tr>' +
                '<td id="' + i + '">' + opleidingArray[i].opleiding + '</td>' +
                '<td id="' + i + '">' + opleidingArray[i].instituut + '</td>' +
                '<td id="' + i + '">' + opleidingArray[i].van + '</td>' +
                '<td id="' + i + '">' + opleidingArray[i].tot + '</td>' +
                '<td id="cmd'+ i + '"><button type="button" class="btn btn-default btn-sm" onclick="updateFieldOpleiding(\'' + id + '\',\'' + i +'\')"><span id="span"'+ i +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                '<td id="del' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="removeOpleiding(\'' + i + '\')"><span id="span"' + i + ' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                '</tr>'
        }

    return table = table + tblHeader + tblBody
}

function addOpleiding(opleidingArrayCount,opleidingHit, opleidingArray, changeHitOpleidingNummer, id) {
    console.info('saveOpleiding: ' + opleidingArrayCount + ' :  ' + opleidingHit )
    if(opleidingHit == 0 ){
        opleidingArrayCount++

        var  opleiding =    $('#txtOpleiding').val()
            ,instituut =    $('#txtInstituut').val()
            ,van =          $('#txtdateDatumVan').val()
            ,tot =          $('#txtDatumTot').val()
            ,opleidingObject = {nr:  opleidingArrayCount, opleiding:opleiding, instituut:instituut, van: van, tot: tot}



        opleidingArray = buildOpleidingArray(opleiding,opleidingArray,opleidingObject)
        var opleidingTBL = tblOpleiding(opleidingArray, id)
        $('#tblOpleiding').html(opleidingTBL)


    }
    else{
        console.info('ELSE WERKERVARING')
        console.info(opleidingArray[changeHitOpleidingNummer].functienaam)
        console.info(changeHitOpleidingNummer)

        var  opleiding =  $('#txtOpeiding').val()
            ,instituut =      $('#txtInstituut').val()
            ,van =          $('#txtdateDatumVan').val()
            ,tot =          $('#txtDatumTot').val()

        opleidingArray[changeHitOpleidingNummer].opleiding = opleiding
        opleidingArray[changeHitOpleidingNummer].instituut = instituut
        opleidingArray[changeHitOpleidingNummer].van = van
        opleidingArray[changeHitOpleidingNummer].tot = tot

        console.info(opleidingArray)


        var opleidingTBL = tblOpleiding(opleidingArray)
        $('#tblOpleiding').html(opleidingTBL)
    }

    $.ajax({
        url: '/admin/saveOpleiding',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({opleiding: opleidingArray, id : id }),
        success: function (response) {
            console.info(response)

            return opleidingArray
        }
    })
}



//Specific functions

function updateFieldOpleiding(id, rowid) {
    console.info('updateOpleiding')
    console.info(id)
    $.ajax({
        url: '/admin/getOpleiding',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id : id }),
        success: function (response) {
            var opleiding = response.cv.opleiding[rowid]
            var opleidingen = response.cv.opleiding

            $('#txtFunctienaam').val(opleiding.functienaam)
            $('#txtBedrijf').val(opleiding.bedrijf)
            $('#txtdateDatumVan').val(opleiding.van)
            $('#txtDatumTot').val(opleiding.tot)

            $('#cmdOpleiding').html('')
            $('#cmdOpleiding').html('<a href="#" class="btn btn-default" id="updatedOpleiding">Wijzigen Opleiding <i class="fa fa-long-arrow-right"></i></a>')

            $('#updatedOpleiding').click(function () {

                var  functienaam =  $('#txtFunctienaam').val()
                    ,bedrijf =      $('#txtBedrijf').val()
                    ,van =          $('#txtdateDatumVan').val()
                    ,tot =          $('#txtDatumTot').val()

                opleidingen[rowid].functienaam = functienaam
                opleidingen[rowid].bedrijf = bedrijf
                opleidingen[rowid].van = van
                opleidingen[rowid].tot = tot

                $.ajax({
                    url: '/admin/saveOpleiding',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({opleiding: opleidingen, id : id }),
                    success: function (response) {
                        console.info(response)

                        $.ajax({
                            url: '/admin/getOpleiding',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({id : id }),
                            success: function (response) {
                                var tblWerkErv = tblOpleiding(response.cv.opleiding, id)
                                $('#tblWerkErvaring').html(tblWerkErv)


                            }
                        })

                    }
                })
            })
        }
    })
}