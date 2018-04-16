/**
 * Created by erik on 4/13/18.
 */
function startCVVaardigheden(id) {
    $.ajax({
        url: '/admin/getVaardigheden',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id : id }),
        success: function (response) {

            var changeHitVaardighedenNummer
            var vaardighedenArrayCount = 0
            var vaardighedenHit = 0
            var vaardighedenArray = []
            var vaardighedenen = response.cv.vaardigheden
            var cvWizzard = addCVWizzard()

            if(vaardighedenen){
                console.info('vaardigheden bestaat')
                var vaardigheden = response.cv.vaardigheden[0]
                var frmaddCVVaardigheden = addCVVaardigheden(vaardigheden)
                var vaardighedenArray = vaardighedenen
                var vaardighedenTBL = tblVaardigheden(vaardighedenArray, id)
            }
            else {
                var frmaddCVVaardigheden = addCVVaardigheden()
            }

            $('#contentElement').html(cvWizzard + frmaddCVVaardigheden )
            $('#txtdateDatumVan').datepicker()
            $('#txtDatumTot').datepicker()
            $('#tblVaardigheden').html(vaardighedenTBL)
            $('#Personalia').removeClass()
            $('#Vaardigheden').addClass('active')


            $('#addVaardigheden').click(function () {
                console.info('ID: ' + id )
                console.info(vaardighedenArray)
                vaardighedenArray = addVaardigheden(vaardighedenArrayCount, vaardighedenHit, vaardighedenArray, changeHitVaardighedenNummer, id)
                console.info('After click Add')
                console.info(vaardighedenArray)
            })

            $('#saveVaardigheden').click(function () {
                console.info('saveWerkervaring: ' + id)
                startCVVaardigheden(id)
            })

            $('#addCategory').click(function () {
                console.info('Category: ' + id)
                getCVCategoryResults(user,id)
            })
        }
    })
}


function addCVVaardigheden(vaardigheden) {

    if(!vaardigheden){
        var formVaardigheden =
            '<div class="tab-pane active fade in" id="tab3"> ' +
            '<div class="row margin-bottom-10" id="frmVaardigheden"> ' +
            '<div class="col-md-6"> ' +
            '<div class="row"> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Functienaam">Vaardigheden</label> ' +
            '<input type="text" class="form-control" name="txtVaardigheden" id="txtVaardigheden" placeholder="Vaardigheden"> ' +
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
            '<h3>Vaardigheden</h3> ' +
            '<p><div id="tblVaardigheden"></div></p> </div> </div> </div>'

        var next =  '<div id="cmdVaardigheden"></div><a href="#" class="btn btn-default" id="addVaardigheden">Toevoegen Vaardigheden <i class="fa fa-long-arrow-right"></i></a></div>'
        var addCategory =  '<button type="button" id="addCategory" class="btn btn-primary">Toevoegen Categorie</button><div class="row"></div> '

        return addCategory + formVaardigheden + next
    }
    else{

        var strVaardigheden = vaardigheden.vaardigheden

        var formVaardigheden =
            '<div class="tab-pane active fade in" id="tab3"> ' +
            '<div class="row margin-bottom-10" id="frmVaardigheden"> ' +
            '<div class="col-md-6"> ' +
            '<div class="row"> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Functienaam">Vaardigheden</label> ' +
            '<input type="text" class="form-control" name="txtVaardigheden" id="txtVaardigheden" value="' + strVaardigheden +'"> ' +
            '</div> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Bedrijf">Instituut</label> ' +
            '<input type="text" class="form-control" name="txtInstituut" id="txtInstituut" value="' + vaardigheden.instituut+'"> ' +
            '</div> ' +
            '<div class="form-group col-md-12"> ' +
            '<label for="van">Titel</label> ' +
            '<input type="text" class="form-control" name="txtDatumVan" id="txtdateDatumVan" value="' + vaardigheden.van+'"> ' +
            '</div> <div class="form-group col-md-12"> ' +
            '<label for="tot">tot</label> ' +
            '<input type="text" class="form-control" name="txtDatumTot" id="txtDatumTot" value="' + vaardigheden.tot+'"> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '<div class="col-md-6"> ' +
            '<h3>Vaardigheden</h3> ' +
            '<p><div id="tblVaardigheden"></div></p> </div> </div> </div>'

        var next =  '<div class="col-md-4"><a href="#" class="btn btn-default" id="updatedVaardigheden">Wijzigen Vaardigheden <i class="fa fa-long-arrow-right"></i></a></div>' +
                    '<div class="col-md-4" align="right"><a href="#" class="btn btn-default" id="addVaardigheden">Toevoegen Vaardigheden <i class="fa fa-long-arrow-right"></i></a></div>' +
                    '<div class="col-md-4" align="right"><a href="#" class="btn btn-default" id="saveVaardigheden">Volgende <i class="fa fa-long-arrow-right"></i></a></div>'

        return formVaardigheden + next
    }
}


function buildVaardighedenArray(vaardigheden, currentArray, vaardighedenObject) {
    console.info('buildVaardighedenArray')
    var newVaardighedenArray = [], roleHit = 0


    //Check if Array exist
    if(currentArray){
        console.info('currentArray Exist')
        //Check if value exist in Array
        currentArray.forEach(function (r) {
            if(vaardigheden == r.vaardigheden){
                roleHit = 1
            }
            if(vaardigheden != r.vaardigheden){
                roleHit = 0
            }
        })
    }
    else {
        console.info('currentArray does not exist')
        currentArray = []
    }

    //If value not exist then add object to the array
    if(roleHit == 0){
        newVaardighedenArray = currentArray
        newVaardighedenArray.push(vaardighedenObject)
    }
    // Else keep the array the same
    else{
        newVaardighedenArray = currentArray
    }

    return newVaardighedenArray
}


function tblVaardigheden(vaardighedenArray, id) {
    var  tblHeader ='<theader><th>Categorie</th><th>Methode/Techniek/Tool</th><th>Aantal jaar</th></theader>'
        ,tblBody = '<tbody>'
        ,table = '<table id="roleTable" class="table table-hover">'

        for (var i = 0; i < vaardighedenArray.length; i++) {
            tblBody = tblBody +
                '<tr>' +
                '<td id="' + i + '">' + vaardighedenArray[i].categorie + '</td>' +
                '<td id="' + i + '">' + vaardighedenArray[i].catDetails + '</td>' +
                '<td id="' + i + '">' + vaardighedenArray[i].duur + '</td>' +
                '<td id="cmd'+ i + '"><button type="button" class="btn btn-default btn-sm" onclick="updateFieldVaardigheden(\'' + id + '\',\'' + i +'\')"><span id="span"'+ i +' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                '<td id="del' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="removeVaardigheden(\'' + i + '\')"><span id="span"' + i + ' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                '</tr>'
        }

    return table = table + tblHeader + tblBody
}

function addVaardigheden(vaardighedenArrayCount,vaardighedenHit, vaardighedenArray, changeHitVaardighedenNummer, id) {
    console.info('saveVaardigheden: ' + vaardighedenArrayCount + ' :  ' + vaardighedenHit )
    console.info('vaardighedensArray:')
    console.info(vaardighedenArray)
    if(vaardighedenHit == 0 ){
        vaardighedenArrayCount++

        var  vaardigheden =    $('#txtVaardigheden').val()
            ,instituut =    $('#txtInstituut').val()
            ,van =          $('#txtdateDatumVan').val()
            ,tot =          $('#txtDatumTot').val()
            ,vaardighedenObject = {nr:  vaardighedenArrayCount, vaardigheden:vaardigheden, instituut:instituut, van: van, tot: tot}

        console.info(vaardighedenArray)

        vaardighedenArray = buildVaardighedenArray(vaardigheden,vaardighedenArray,vaardighedenObject)
        var vaardighedenTBL = tblVaardigheden(vaardighedenArray, id)
        $('#tblVaardigheden').html(vaardighedenTBL)

    }
    else{
        console.info('ELSE WERKERVARING')
        console.info(vaardighedenArray[changeHitVaardighedenNummer].functienaam)
        console.info(changeHitVaardighedenNummer)

        var  vaardigheden =  $('#txtOpeiding').val()
            ,instituut =  $('#txtInstituut').val()
            ,van =        $('#txtdateDatumVan').val()
            ,tot =        $('#txtDatumTot').val()

        vaardighedenArray[changeHitVaardighedenNummer].vaardigheden = vaardigheden
        vaardighedenArray[changeHitVaardighedenNummer].instituut = instituut
        vaardighedenArray[changeHitVaardighedenNummer].van = van
        vaardighedenArray[changeHitVaardighedenNummer].tot = tot

        console.info(vaardighedenArray)


        var vaardighedenTBL = tblVaardigheden(vaardighedenArray)
        $('#tblVaardigheden').html(vaardighedenTBL)
    }

    $.ajax({
        url: '/admin/saveVaardigheden',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({vaardigheden: vaardighedenArray, id : id }),
        success: function (response) {
            console.info(response)
        }
    })

    return vaardighedenArray
}



//Specific functions
function updateFieldVaardigheden(id, rowid) {
    console.info('updateVaardigheden')
    console.info(id)
    console.info(rowid)
    $.ajax({
        url: '/admin/getVaardigheden',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id : id }),
        success: function (response) {
            var vaardigheden = response.cv.vaardigheden[rowid]
            var vaardighedenen = response.cv.vaardigheden

            console.info(vaardigheden)
            var strVaardigheden = vaardigheden.vaardigheden
            console.info(strVaardigheden)

            $('#txtVaardigheden').val(strVaardigheden)
            $('#txtInstituut').val(vaardigheden.instituut)
            $('#txtdateDatumVan').val(vaardigheden.van)
            $('#txtDatumTot').val(vaardigheden.tot)

            $('#cmdVaardigheden').html('')
            $('#cmdVaardigheden').html('<a href="#" class="btn btn-default" id="updatedVaardigheden">Wijzigen Vaardigheden <i class="fa fa-long-arrow-right"></i></a>')

            $('#updatedVaardigheden').click(function () {

                var  vaardigheden =  $('#txtOpeiding').val()
                    ,instituut =  $('#txtInstituut').val()
                    ,van =        $('#txtdateDatumVan').val()
                    ,tot =        $('#txtDatumTot').val()

                vaardighedenen[rowid].vaardigheden = vaardigheden
                vaardighedenen[rowid].instituut = instituut
                vaardighedenen[rowid].van = van
                vaardighedenen[rowid].van = tot

                $.ajax({
                    url: '/admin/saveVaardigheden',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({vaardigheden: vaardighedenen, id : id }),
                    success: function (response) {
                        console.info(response)

                        $.ajax({
                            url: '/admin/getVaardigheden',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({id : id }),
                            success: function (response) {
                                var vaardighedenTBL = tblVaardigheden(response.cv.vaardigheden, id)
                                $('#tblVaardigheden').html(vaardighedenTBL)

                            }
                        })

                    }
                })
            })
        }
    })
}