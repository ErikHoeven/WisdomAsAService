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

            console.info(respCV)
            var response = respCV.returnObject
            var changeHitVaardighedenNummer
            var vaardighedenArrayCount = 0
            var vaardighedenHit = 0
            var vaardighedenArray = []
            var cvWizzard = addCVWizzard()
            var catValues = response.vaardighedenCategorie
            var vaardigheden = response.cv.vaardigheden
            var cv = response.cv
            var id = response.cv._id
            var vaardighedenTabel

            if (vaardigheden) {
                console.info('vaardigheden bestaat')
                //console.info('Code nog te programeren')

                console.info(vaardigheden)
                vaardighedenArray = vaardigheden
                var tabelVaardigheden = tblVaardigheden(vaardigheden,id)
            }
            if (catValues){
                console.info('vaardigheden niet gevonden. CatValues wel gevonden')

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
                $('#tblVaardigheden').html(tblVaardigheden)
                $('#txtDatumTot').datepicker()
                if(tabelVaardigheden){
                    $('#tblVaardigheden').html(tabelVaardigheden)
                }

                $('#Personalia').removeClass()
                $('#Vaardigheden').addClass('active')
                $('#addVaardigheden').click(function () {
                    console.info('ID: ' + id )
                    console.info(vaardighedenArray)
                    if(vaardighedenArray){
                        vaardighedenArrayCount = vaardighedenArray.length
                        console.info(vaardighedenArrayCount)
                    }
                    vaardighedenArray = addVaardigheden(vaardighedenArrayCount, vaardighedenHit, vaardighedenArray, changeHitVaardighedenNummer, id)

                    console.info('After click Add')
                    console.info(vaardighedenArray)
                    startCVVaardigheden(id)

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
                    getSkill(selectedCat,id)
                })
            }
        }})
    }

function addCVVaardigheden(vaardigheden, catValues) {

    if(!vaardigheden){
        console.info('addCVVaardigheden bestaat niet')
        var inpVaardigheden = '<select id="selVaardigheden"><option value=""></option></select>'


        console.info('(2) Vaardigheden niet gevonden')
        var formVaardigheden =
            '<p><div class="tab-pane active fade in" id="tab3"> ' +
                '<div class="row margin-bottom-10" id="frmVaardigheden"> ' +
                    '<div class="row"> ' +
                        '<div class="col-md-4"> ' +
                            '<div class="form-group col-md-4"> ' +
                                '<label for="Categorie">Categorie</label> ' +
                                catValues +
                            '</div> ' +
                        '</div> ' +
                    '</div>' +
                    '<div class="row"> ' +
                        '<div class="col-md-4"> ' +
                            '<div class="form-group col-md-4"> ' +
                                '<label for="Vaardigheid">Vaardigheid</label> ' +
                                '<div id="vaardigheden">' + inpVaardigheden + '</div>' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                    '<div class="row"> ' +
                        '<div class="col-md-6"> ' +
                            '<div class="form-group col-md-6"> ' +
                                '<label for="van">Aantal jaren </label> ' +
                                '<input type="text" class="form-control" name="txtAantalJaren" id="txtAantalJaren" placeholder="AantalJaren"> ' +
                        '</div> ' +
                    '</div> ' +
                '</div>' +
            '</div></p>'
        var next =  '<div id="cmdVaardigheden"></div><a href="#" class="btn btn-default" id="addVaardigheden">Toevoegen Vaardigheden <i class="fa fa-long-arrow-right"></i></a></div>'
        var addCategory =  '<div class="row"><div class="col-md-4"><button type="button" id="addCategory" class="btn btn-primary">Toevoegen Categorie</button></div></div>'
        var next =  '<div id="cmdVaardigheden"></div><a href="#" class="btn btn-default" id="addVaardigheden">Toevoegen Vaardigheden <i class="fa fa-long-arrow-right"></i></a></div>'
        var addCategory =  '<button type="button" id="addCategory" class="btn btn-primary">Toevoegen Categorie</button>'
        return addCategory + formVaardigheden + next
    }
    else{
        var formVaardigheden =
            '<p>' +
                '<div class="tab-pane active fade in" id="tab3"> ' +
                    '<div class="row margin-bottom-10" id="frmVaardigheden"> ' +
                        '<div class="row"> ' +
                            '<div class="col-md-4"> ' +
                                '<div class="form-group col-md-4"> ' +
                                    '<label for="Categorie">Categorie</label> ' +
                                    catValues +
                                '</div> ' +
                            '</div> ' +
                        '</div>' +
                        '<div class="row"> ' +
                            '<div class="col-md-4"> ' +
                                 '<div class="form-group col-md-4"> ' +
                                    '<label for="Vaardigheid">Vaardigheid</label> ' +
                                    '<div id="vaardigheden">' + inpVaardigheden + '</div>' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                    '<div class="row"> ' +
                        '<div class="col-md-6"> ' +
                            '<div class="form-group col-md-6"> ' +
                                '<label for="van">Aantal jaren </label> ' +
                                '<input type="text" class="form-control" name="txtAantalJaren" id="txtAantalJaren" placeholder="AantalJaren"> ' +
                        '</div> ' +
                    '</div> ' +
                '</div>' +
            '</p>' +
            '<h4>Opleiding</h4>' +
                '<p><div id="tblVaardigheden"></div>'
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
        console.info(currentArray)
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
    console.info('------> addVaardigheden <----------------' )
    console.info('saveVaardigheden: ' + vaardighedenArrayCount + ' :  ' + vaardighedenHit )
    console.info('vaardighedensArray:')
    console.info(vaardighedenArray)
    if(vaardighedenHit == 0 ){
        console.info('vaardighedenHit == 0')
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
            console.info('Response:')
            console.info(response)
            var vaardigheden = response.returnObject.cv.vaardigheden
            console.info(vaardigheden)
            console.info(vaardigheden.length)
            if (vaardigheden) {
                console.info('------------  BUILD OPTION LIST VAARDIGHEDEN -----------------')
                var vaardigheid = vaardigheden[rowid]
                console.info(vaardigheid)

                var catValues = response.returnObject.catValues
                console.info(catValues)

                $('#selCatVaardigheden option:contains("' + vaardigheden.categorie  + '") ').prop("selected", true)
                console.info(vaardigheid.categorie)
                console.info(_.where(catValues,{tagCattegory: vaardigheden.categorie}))
                var lstVaardigheden = _.where(catValues,{tagCattegory: vaardigheid.categorie})[0].cattegoryValue
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
function getSkill(Skill,id) {
    console.info('FUNCTION GET SKILL')
    $.ajax({
        url: '/admin/getVaardigheden',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id}),
        success: function (response) {
           var catList = response.returnObject.catValues
           var skill_list = _.where(catList,{'tagCattegory':Skill })[0].cattegoryValue
           var skillOptionList  = ' <select id="selVaardigheden">'
            skill_list.forEach(function (r) {
                skillOptionList = skillOptionList + '<option values="'+ r +'">' + r + '</option>'
            })
            skillOptionList = skillOptionList + '</select>'
            $('#vaardigheden').html(skillOptionList)
        }
    })

}


