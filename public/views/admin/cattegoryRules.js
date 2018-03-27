// A. change menu Zoek criteria red the rest blue.
function selectCategoryMenu() {
    $('#home').removeClass()
    $('#search').removeClass()
    $('#category').addClass('active-menu')
}

// B. Change title and subtitle
function setCategoryTitle() {
    $('#title').html('Cattegorie instellingen')
    $('#subtitle').html('Stel hier de waarde in waarop gegroepeerd op de gevonden resultaten van uw social media kanalen')
}

// C. Get Search results from MongoDB if no results are available show form
function getCategoryResults(user) {
    $.ajax({
        url: '/admin/getCattegoryResults',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {

            var  tblHeader ='<theader><th>Categorie Waarden</th></theader>'
                ,tblBody = '<tbody>'
                ,clear = 0
                ,catValueList = []
                ,catValueStr
                ,table


            if (response.count == 0 ){
                //1. Form show
                $('#contentElement').html('<div class=\"col-lg-6\">' +
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
                    '</div><div id="CatValueTable"></div><input type="submit" name="addCattegory" id="addCattegory" value="Toevoegen" class="btn btn-info pull-left">')

                //2. Add category value
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
                //3. Clear category value
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

                //4. Colour Control
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

                //5. Submit
                $('#addCattegory').click(function () {
                    var category = $('#Categorie').val()
                       ,categoryColor = $('#txtKleur').val()

                    addCategoryResults(category,categoryColor, catValueList)


                })
            }
            else {
                console.info(response.businessrules)
                $('#contentElement').html('')
                var table = '<table class="table table-hover">' + response.header + response.body + '</table>'
                $('#contentElement').html(table)

            }}})}

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

 function updateCategoryField(id, Category, Color){

     //a. Change field Cattegory in page to input fields (works)
     $('#Cattegory' + id).html('<input type="text" id="editCategory' + id +'" placeholder="'+ Category +'" class="form-control"></input>')
     //b. Change field Color in page to input fields (works)
     $('#Color' + id).html('<input type="text" value="' + Color + '" name="editColor"' + id +' id="editColor' + id  +'" class="pick-a-color form-control" ;">')

     //c. Change color input field to a color picker (does not work)
     $(".pick-a-color").pickAColor({
         showSpectrum            : true,
         showSavedColors         : true,
         saveColorsPerElement    : true,
         fadeMenuToggle          : true,
         showAdvanced			 : true,
         showBasicColors         : true,
         showHexInput            : true,
         allowBlank				 : true,
         inlineDropdown			 : true
     });
     // d. Change button to save functionality
     $('#edit' + id).html('')
     $('#edit' + id).append('<button id="edit'+ id+'" type="button" class="btn btn-default btn-sm" onclick="updateCategoryValue(\'' + id + '\')"><span class="glyphicon glyphicon-save"></span> Edit</button>')
 }

 function updateCategoryValue (id) {
     var newValueCategory = $('#editCategory' + id).val()
     var newValueColor = $('#editColor' + id).val()
     $.ajax({
         url: '/admin/editCategoryResults',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({id: id, Color: newValueColor , Category: newValueCategory}),
         success: function (response) {
             getCategoryResults(user)
         }
     })}

 function removeCategoryValue(id) {
     $.ajax({
         url: '/admin/removeCategoryResults',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({id: id}),
         success: function (response) {
             getCategoryResults(user)
         }
     })}
