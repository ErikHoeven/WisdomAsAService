/**
 * Created by erik on 4/13/18.
 */
function startCVVaardigheden(id) {
    console.info('startCVVaardigheden')

    $.ajax({
        url: '/admin/getVaardigheden',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id : id }),
        success: function (respCV) {

            var changeHitVaardighedenNummer
            var vaardighedenArrayCount = 0
            var vaardighedenHit = 0
            var vaardighedenArray = []
            var vaardighedenen = respCV.cv.vaardigheden
            var cvWizzard = addCVWizzard()

            if(vaardighedenen){
                console.info('vaardigheden bestaat')
                var vaardigheden = respCV.cv.vaardigheden[0]
                var vaardighedenArray = respCV.cv.vaardigheden
                var vaardighedenTabel = tblVaardigheden(vaardighedenArray, id)

            }
            else {
                console.info('Geen vaardigheden toegevoegd')
                var frmaddCVVaardigheden = addCVVaardigheden(vaardigheden,catValues)
            }

            $.ajax({
                url: '/admin/getCatVaardigheden',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({id : id }),
                success: function (response) {

                    //Build form an values
                    var catValues = response.catValues
                    var frmaddCVVaardigheden = addCVVaardigheden(vaardigheden,catValues)

                    $('#contentElement').html(cvWizzard + frmaddCVVaardigheden )

                    // Navigation Menu through the CV
                    $('#Personalia').click(function () {
                        console.info('Personalia')
                        addCVPeronaliaForm(cv)
                    })

                    $('#Profiel').click(function () {
                        console.info('Profiel')
                        startCVProfiel(id,cv)
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

                    // From elements scenarios
                    $('#txtdateDatumVan').datepicker()
                    $('#txtDatumTot').datepicker()
                    $('#tblVaardigheden').html(vaardighedenTabel)
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
                        setCVCategoryVaardighedenTitle()
                        getCVCategoryVaardighedenResults(user,id)
                    })

                    $('#selCatVaardigheden').change(function () {
                        var selectedCat = $('#selCatVaardigheden option:selected').text()
                        var lstVaardigheden = _.where(catValues,{tagCattegory: selectedCat})[0].cattegoryValue
                        var inpVaardigheden = ''

                        inpVaardigheden = '<select id="selVaardigheden">'
                        lstVaardigheden.forEach(function (r) {
                            inpVaardigheden = inpVaardigheden + '<option value="'+ r + '">' + r + '</option>'
                        })
                        inpVaardigheden = inpVaardigheden + '</select>'

                        $('#vaardigheden').html(inpVaardigheden)
                    })

                }})
            }
        })
    }



function addCVVaardigheden(vaardigheden, catValues) {

    var inpVaardighedenCategorie = '<input type="text" class="form-control" name="txtCatVaardigheden" id="txtCatVaardigheden" placeholder="Vaardigheden"> '

    if(catValues){
        console.info('catValues')
        inpVaardighedenCategorie = '<select id="selCatVaardigheden">'
        catValues.forEach(function (r) {
            inpVaardighedenCategorie = inpVaardighedenCategorie + '<option value="'+ r.tagCattegory + '">' + r.tagCattegory + '</option>'
        })
        inpVaardighedenCategorie = inpVaardighedenCategorie + '</select>'

        var selectedCat = catValues[0].tagCattegory
        var lstVaardigheden = _.where(catValues,{tagCattegory: selectedCat})[0].cattegoryValue
        var inpVaardigheden = ''

        inpVaardigheden = '<select id="selVaardigheden">'
        lstVaardigheden.forEach(function (r) {
            inpVaardigheden = inpVaardigheden + '<option value="'+ r + '">' + r + '</option>'
        })
        inpVaardigheden = inpVaardigheden + '</select>'
    }

    if(!vaardigheden){
        console.info('Vaardigheden niet gevonden')
        console.info(inpVaardighedenCategorie)

        var formVaardigheden =
            '<p><div class="tab-pane active fade in" id="tab3"> ' +
                '<div class="row margin-bottom-10" id="frmVaardigheden"> ' +
                    '<div class="col-md-6"> ' +
                        '<div class="form-group col-md-4"> ' +
                            '<label for="Categorie">Categorie</label> ' +
                            inpVaardighedenCategorie +
                        '</div> ' +
                        '<div class="form-group col-md-4"> ' +
                            '<label for="Vaardigheid">Vaardigheid</label> ' +
                            '<div id="vaardigheden">' + inpVaardigheden + '</div>' +
                        '</div> ' +
                        '<div class="form-group col-md-8"> ' +
                            '<label for="van">Aantal jaren ervaring</label> ' +
                            '<input type="text" class="form-control" name="txtAantalJaren" id="txtAantalJaren" placeholder="AantalJaren"> ' +
                        '</div> ' +
                    '</div> ' +
                    '<div class="col-md-6"> ' +
                        '<h4>Vaardigheden</h4> ' +
                        '<div id="tblVaardigheden"></div>' +
                    ' </div>' +
                ' </div> ' +
            '</div>'
        var next =  '<div id="cmdVaardigheden"></div><a href="#" class="btn btn-default" id="addVaardigheden">Toevoegen Vaardigheden <i class="fa fa-long-arrow-right"></i></a></div>'
        var addCategory =  '<div class="row"><div class="col-md-4"><button type="button" id="addCategory" class="btn btn-primary">Toevoegen Categorie</button></div></div>'
        var next =  '<div id="cmdVaardigheden"></div><a href="#" class="btn btn-default" id="addVaardigheden">Toevoegen Vaardigheden <i class="fa fa-long-arrow-right"></i></a></div>'
        var addCategory =  '<button type="button" id="addCategory" class="btn btn-primary">Toevoegen Categorie</button>'
        return addCategory + formVaardigheden + next
    }
    else{
        var formVaardigheden =
            '<p><div class="tab-pane active fade in" id="tab3"> ' +
            '<div class="row margin-bottom-10" id="frmVaardigheden"> ' +
            '<div class="col-md-6"> ' +
            '<div class="form-group col-md-4"> ' +
            '<label for="Categorie">Categorie</label> ' +
            inpVaardighedenCategorie +
            '</div> ' +
            '<div class="form-group col-md-4"> ' +
            '<label for="Vaardigheid">Vaardigheid</label> ' +
            '<div id="vaardigheden">' + inpVaardigheden + '</div>' +
            '</div> ' +
            '<div class="form-group col-md-8"> ' +
            '<label for="van">Aantal jaren ervaring</label> ' +
            '<input type="text" class="form-control" name="txtAantalJaren" id="txtAantalJaren" placeholder="AantalJaren" value="'+ vaardigheden.aantaljaar +'"> '  +
            '</div> ' +
            '</div> ' +
            '<div class="col-md-6"> ' +
            '<h4>Vaardigheden</h4> ' +
            '<div id="tblVaardigheden"></div>' +
            ' </div>' +
            ' </div> ' +
            '</div>'
        var next =  '<div id="cmdVaardigheden"></div><a href="#" class="btn btn-default" id="addVaardigheden">Toevoegen Vaardigheden <i class="fa fa-long-arrow-right"></i></a></div>'
        var addCategory =  '<div class="row"><div class="col-md-4"><button type="button" id="addCategory" class="btn btn-primary">Toevoegen Categorie</button></div></div>'
        var next =  '<div id="cmdVaardigheden"></div><a href="#" class="btn btn-default" id="addVaardigheden">Toevoegen Vaardigheden <i class="fa fa-long-arrow-right"></i></a></div>'
        var addCategory =  '<button type="button" id="addCategory" class="btn btn-primary">Toevoegen Categorie</button>'
        return addCategory + formVaardigheden + next
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
    var  tblHeader ='<theader><th>Categorie</th><th>Vaardigheden</th><th>Aantal jaar</th></theader>'
        ,tblBody = '<tbody>'
        ,table = '<table id="roleTable" class="table table-hover">'

        for (var i = 0; i < vaardighedenArray.length; i++) {
            tblBody = tblBody +
                '<tr>' +
                '<td id="' + i + '">' + vaardighedenArray[i].categorie + '</td>' +
                '<td id="' + i + '">' + vaardighedenArray[i].vaardigheid + '</td>' +
                '<td id="' + i + '">' + vaardighedenArray[i].aantaljaar + '</td>' +
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

        var  categorie =            $('#selCatVaardigheden option:selected').text()
            ,vaardigheid =          $('#selVaardigheden option:selected').text()
            ,aantaljaar =           $('#txtAantalJaren').val()
            ,vaardighedenObject =   {nr:  vaardighedenArrayCount, categorie:categorie, vaardigheid:vaardigheid, aantaljaar: aantaljaar}

        console.info(vaardighedenArray)

        vaardighedenArray = buildVaardighedenArray(vaardigheden,vaardighedenArray,vaardighedenObject)
        var vaardighedenTBL = tblVaardigheden(vaardighedenArray, id)
        $('#tblVaardigheden').html(vaardighedenTBL)

    }
    else{
        console.info('ELSE WERKERVARING')
        console.info(vaardighedenArray[changeHitVaardighedenNummer].functienaam)
        console.info(changeHitVaardighedenNummer)

        var  categorie =            $('#selCatVaardigheden option:selected').text()
            ,vaardigheid =          $('#selVaardigheden option:selected').text()
            ,aantaljaar =           $('#txtAantalJaren').val()

        vaardighedenArray[changeHitVaardighedenNummer].categorie = categorie
        vaardighedenArray[changeHitVaardighedenNummer].vaardigheid = vaardigheid
        vaardighedenArray[changeHitVaardighedenNummer].aantaljaar = aantaljaar

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

            if (response.cv.vaardigheden) {
                var vaardigheden = response.cv.vaardigheden[rowid]
                var vaardighedenen = response.cv.vaardigheden
                var catValues = response.catValues

                $('#selCatVaardigheden option:contains("' + vaardigheden.categorie  + '") ').prop("selected", true)

                var lstVaardigheden = _.where(catValues,{tagCattegory: vaardigheden.categorie})[0].cattegoryValue
                var inpVaardigheden = ''

                inpVaardigheden = '<select id="selVaardigheden">'
                lstVaardigheden.forEach(function (r) {
                    inpVaardigheden = inpVaardigheden + '<option value="'+ r + '">' + r + '</option>'
                })
                inpVaardigheden = inpVaardigheden + '</select>'

                $('#vaardigheden').html(inpVaardigheden)
                $('#selVaardigheden option:contains("' + vaardigheden.vaardigheid  + '")').prop("selected", true)
                $('#txtAantalJaren').val(vaardigheden.aantaljaar)


                $('#cmdVaardigheden').html('<a href="#" class="btn btn-default" id="updatedVaardigheden">Wijzigen Vaardigheden <i class="fa fa-long-arrow-right"></i></a>')

                $('#updatedVaardigheden').click(function () {

                    var vaardigheden = $('#txtOpeiding').val()
                        , instituut = $('#txtInstituut').val()
                        , van = $('#txtdateDatumVan').val()
                        , tot = $('#txtDatumTot').val()

                    vaardighedenen[rowid].vaardigheden = vaardigheden
                    vaardighedenen[rowid].instituut = instituut
                    vaardighedenen[rowid].van = van
                    vaardighedenen[rowid].van = tot

                    $.ajax({
                        url: '/admin/saveVaardigheden',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({vaardigheden: vaardighedenen, id: id}),
                        success: function (response) {
                            console.info(response)

                            $.ajax({
                                url: '/admin/getVaardigheden',
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify({id: id}),
                                success: function (response) {
                                    var vaardighedenTBL = tblVaardigheden(response.cv.vaardigheden, id)
                                    $('#tblVaardigheden').html(vaardighedenTBL)

                                }
                            })

                        }
                    })
                })
            }
        else{
            console.info('Geen vaardigheden gevonden op huidige CV')
        }
    }
    })
}

