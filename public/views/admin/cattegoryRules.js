// A. change menu Zoek criteria red the rest blue.
function selectCategoryMenu() {
    console.info('setMenu')
    $('#search').removeClass()
    $('#home').removeClass()
    $('#category').addClass('active-menu')
    $('#sentiment').removeClass()
    $('#dictionary').removeClass()
    $('#employee').removeClass()
    $('#content').removeClass()
    $('#blog').removeClass()
}

// B. Change title and subtitle
function setCategoryTitle() {
    $('#title').html('Cattegorie instellingen')
    $('#subtitle').html('Stel hier de waarde in waarop gegroepeerd op de gevonden resultaten van uw social media kanalen')
}

// C. Get Search results from MongoDB if no results are available show form
function getCategoryResults(user) {

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
        '<button type="button" class="btn btn-primary btn-flat btn-raised btn-float" id="cmdEmployeeForm"><span class="fa fa-plus"></span></button>' +
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
                url: '/admin/getCattegoryResults',
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
    $('#cmdEmployeeForm').click(function () {
        console.info('cmdEmployeeForm')

        $('#contentElement').html(addCatForm ())
        var  tblHeader ='<theader><th>Categorie Waarden</th></theader>'
            ,tblBody = '<tbody>'
            ,clear = 0
            ,catValueList = []
            ,catValueStr
            ,table

        //3.A Add category value
        $('#addCatValue').click(function () {
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
        $('#clearCatValue').click(function () {
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

        //3.C Colour Control
        $(".pick-a-color").pickAColor({
            showSpectrum            : true,
            showSavedColors         : true,
            saveColorsPerElement    : true,
            fadeMenuToggle          : true,
            showAdvanced			: true,
            showBasicColors         : true,
            showHexInput            : true,
            allowBlank				: true,
            inlineDropdown			: true
        });

        //3.D Submit
        $('#addCattegory').click(function () {
            var category = $('#Categorie').val()
                ,categoryColor = $('#txtKleur').val()

            addCategoryResults(category,categoryColor, catValueList)
        })
    })
}
function addCategoryResults(category, color, catValues) {
    $.ajax({
        url: '/admin/addCategoryResults',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({category: category, color: color, catValues:catValues }),
        success: function (response) {
            console.info(response)
            getCategoryResults(user)
        }
    })
}

// 2.A. Update row to editable fields
function updateCategoryField(tagCattegory) {
    $.ajax({
        url: '/admin/getCategoryResultsForm',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tagCattegory: tagCattegory}),
        success: function (response) {
            console.info('getContentResultsForm')
            console.info(response)

            //3 Show results
            $('#contentElement').html('')
            $('#contentElement').html(response.form.form)
            $('#CatValueTable').html(response.form.catValueForm)


            $('#cmdAddBlog').click(function () {

                var titel = $('#txtTitel').val()
                var chanel = $('#selChanel option:selected').text()
                var auteur = $('#selEmployee option:selected').text()
                var artikel = CKEDITOR.instances['txtArtikel'].getData()


                $.ajax({
                    url: '/admin/saveBlogResults',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({titel: titel, chanel: chanel, artikel:artikel, auteur:auteur}),
                    success: function (response) {
                    }
                })
            })

            $('#selSection').on('change', function () {

                var name = $('#txtPageName').val()
                var section = this.value

                $.ajax({
                    url: '/admin/getBlogText',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({name: name, section: section}),
                    success: function (response) {
                        console.info(response)

                        CKEDITOR.instances['txtBlog'].setData(response.content)

                    }
                })
            })
        }
    })
}











//  SPECIFIC FUNCTIONS

function addCatForm () {

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
        '<button class="btn btn-primary" type="submit" id="addCatValue">Toevoegen</button>' +
        '<button class="btn btn-primary" type="submit" id="clearCatValue">Wissen</button>' +
        '<\/div>' +
        '<div class="form-group"><label>Kleur</label>' +
        '<div class="input-group"><input type="text" name="txtkleur" id="txtKleur" class="pick-a-color form-control">' +
        '</div><div id="CatValueTable"></div><input type="submit" name="addCattegory" id="addCattegory" value="Toevoegen" class="btn btn-info pull-left">'


    return catform
}

