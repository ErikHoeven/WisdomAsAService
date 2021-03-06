/**
 * Created by erik on 4/16/18.
 */
// B. Change title and subtitle
function setCVCategoryVaardighedenTitle() {
    $('#title').html('Cattegorie instellingen voor Vaardigheden')
    $('#subtitle').html('Stel hier de Categorie voor de vaardigheden die u heeft')
}

// C. Get Search results from MongoDB if no results are available show form
function getCVCategoryVaardighedenResults(user, id) {

        //1. Form search for word
    $('#contentElement').html(
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<h4 style="margin-bottom: 25px; text-align: left">Zoeken cattegorie</h4>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<input type="text" class="form-control" id="txtSearchWord" name="txtSearchWord" placeholder="zoekterm">' +
        '</div>' +
        '<div class="col-md-5">' +
        '<button type="button" class="btn btn-primary btn-flat btn-raised btn-float" id="addCVCategorieVaardigeheden"><span class="fa fa-plus"></span></button>' +
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
                url: '/admin/getCVCattegoryVaardighedenResults',
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
    //3. add Cattegory form results when press + button
    $('#addCVCategorieVaardigeheden').click(function () {
        console.info('addCVCategorieVaardigeheden')

        $('#contentElement').html(addCVCatVaardigehedenForm ())
        var  tblHeader ='<theader><th>Categorie Waarden</th></theader>'
            ,tblBody = '<tbody>'
            ,clear = 0
            ,catValueList = []
            ,catValueStr
            ,table

        //3.A Add category value
        $('#addCattegoryVaardigheden').click(function () {
            if($('#CatValue').val().length > 0){
                catValueList.push($('#CatValue').val())
                console.info(catValueList)
                catValueStr = ''
                tblBody = '<tbody>'
                catValueList.forEach(function (r) {
                    catValueStr = catValueStr + '<tr><td>'+ r +'</td></tr>'
                })

                tblBody = tblBody + catValueStr + '</tbody>'
                table = '<table class="table table-hover">' + tblHeader + tblBody + '</table>'
                $('#CatValueTable').html(table)


                $('#CatValue').val('')
            }
        })

        //3.B Clear category value
        $('#clearCatVaardighedenValue').click(function () {
            console.info(catValueList)
            //clear = 1
            catValueList = []
            table = ''
            tblBody = ''
            tblHeader = ''
            $('#CatValueTable').html('')
            $('#CatValue').val('')

            console.info(catValueList.length)
        })



        //3.D Submit
        $('#saveCattegoryVaardigheden').click(function () {
            var category = $('#Categorie').val()

            addCategoryVaardigehedenResults(category, catValueList)
            startCVVaardigheden(id)

        })
    })
}
function addCategoryVaardigehedenResults(category, catValues) {
    $.ajax({
        url: '/admin/addCategoryVaardighedenResults',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({category: category, catValues:catValues }),
        success: function (response) {
            console.info(response)
            getCategoryResults(user)
        }
    })
}

// 2.A. Update row to editable fields
function updateCategoryVaardigehedenField(tagCattegory) {
    var clickCount = 0

    $.ajax({
        url: '/admin/getCategoryVaardighedenResultsForm',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tagCattegory: tagCattegory}),
        success: function (response) {
            console.info('getContentResultsForm')
            console.info(response)

            //3 Show results
            $('#contentElement').html('')
            $('#contentElement').html(response.form.form)
            var catValueList = response.form.catValueList

            $('#CatValueTable').html(addCatValueForm(catValueList))

            $('#addCattegory').click(function () {
                clickCount++
                console.info(clickCount)
                addCatValue(clickCount)
            })

        }
    })
}

function updateCategoryVaardigehedenValueField(nr, oldValue, catValue) {
    $('#' + nr).html('<input type="text" id="editedCatValue'+ nr +'" value="'+ oldValue  +'">')
    $('#edit' + nr).html('<td id="save' + nr + '"><button type="button" class="btn btn-default btn-sm" onclick="updateCategoryValue(\'' + nr + '\')"><span id="span"' + nr + ' class="glyphicon glyphicon-save"></span> save</button></td>')
}

function updateCategoryVaardigehedenValue(pos ) {
    var newValue = $('#editedCatValue' + pos).val()
        ,cat = $('#Categorie').val()

    $.ajax({
        url: '/admin/saveCatValue',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({category: cat ,pos: pos, value: newValue, color: color}),
        success: function (response) {
            console.info(response)
            updateCategoryField(response.cat)

        }
    })
}

function addCatVaardigehedenValue(clickCount){

    var cat =  $('#Categorie').val()

    $.ajax({
        url: '/admin/addCatValue',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tagCattegory: cat }),
        success: function (response) {
            console.info(response)
            $('#CatValueTable').html(addCatVaardigehedenValueForm(response.catValues,clickCount))

        }
    })
}
function removeCategoryVaardigehedenValue(pos) {
    var cat =  $('#Categorie').val()

    $.ajax({
        url:
            '/admin/removeCatVaardighedenValue',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tagCattegory: cat, pos: pos }),
        success: function (response) {
            console.info(response)
            $('#CatValueTable').html(addCatVaardigehedenValueForm(response.cattegoryValue))

        }
    })

}

//  SPECIFIC FUNCTIONS
function addCVCatVaardigehedenForm () {
    var catform =
        '<div class=\"col-lg-6\">' +
        '<div class="form-group">' +
        '<label>Categorie</label>' +
        '<div class="input-group">' +
        '<input type="text" class="form-control" name="Categorie" id="Categorie" placeholder="Categorie">' +
        '</div></div>' +
        '<div class="form-group">' +
        '<label>Cattegoie waarde</label>' +
        '<div class="input-group">' +
        '<input type="email" class="form-control" id="CatValue" name="CatValue" placeholder="Categorie waarde">' +
        '<button class="btn btn-primary" type="submit" id="addCattegoryVaardigheden">Toevoegen</button>' +
        '<button class="btn btn-primary" type="submit" id="clearCatVaardighedenValue">Wissen</button>' +
        '</div>' +
        '</div><div id="CatValueTable"></div><input type="submit" name="saveCattegoryVaardigheden" id="saveCattegoryVaardigheden" value="Opslaan" class="btn btn-info pull-left">'

    return catform
}

function addCatVaardigehedenValueForm(catValueList,editNr) {

    var  tblHeader ='<theader><th>Categorie Waarden</th></theader>'
        ,tblBody = '<tbody>'
        ,clear = 0
        ,catValueStr
        ,table = '<table id="catValueTable" class="table table-hover">'

    if(!editNr) {
        for (var i = 0; i < catValueList.length; i++) {
            tblBody = tblBody +
                '<tr>' +
                '<td id="' + i + '">' + catValueList[i] + '</td>' +
                '<td id="edit' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="updateCategoryValueField(\'' + i + '\',\'' + catValueList[i] +'\')"><span id="span"' + i + ' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                '<td id="del' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="removeCategoryValue(\'' + i + '\')"><span id="span"' + i + ' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                '</tr>'

        }
    }
    else{

        var catVaardigehedenValueLength = catValueList.length + editNr

        for (var i = 0; i < catValueLength; i++) {

            if ( i <  catValueLength - 1){

                tblBody = tblBody +
                    '<tr>' +
                    '<td id="' + i + '">' + catValueList[i] + '</td>' +
                    '<td id="edit' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="updateCategoryValueField(\'' + i + '\',\'' + catValueList[i] +'\')"><span id="span"' + i + ' class="glyphicon glyphicon-edit"></span> Edit</button></td>' +
                    '<td id="del' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="removeCategoryValue(\'' + i + '\')"><span id="span"' + i + ' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                    '</tr>'
            }
            if(i >= catValueLength -1 ) {
                console.info('else: '   +i)
                tblBody = tblBody +
                    '<tr>' +
                    '<td id="' + i + '"><input type="text" id="editedCatValue'+ i +'"></td>' +
                    '<td id="save' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="updateCategoryValue(\'' + i + '\')"><span id="span"' + i + ' class="glyphicon glyphicon-save"></span> save</button></td>' +
                    '<td id="del' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="removeCategoryValue(\'' + i + '\')"><span id="span"' + i + ' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                    '</tr>'
            }

        }
    }
    return table = table + tblHeader + tblBody
}

function removeCategoryVaardigehedenResults(id) {

    $.ajax({
        url:
            '/admin/removeCatVaardighedenResults',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id }),
        success: function (response) {
            console.info(response)
            //$('#CatValueTable').html(addCatVaardigehedenValueForm(response.cattegoryValue))
        }
    })

}

