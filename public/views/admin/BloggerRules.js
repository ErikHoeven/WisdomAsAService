 // A. change menu Dictionario to red and the rest blue.
function selectBlogMenu() {
    console.info('setMenu')
    $('#search').removeClass()
    $('#home').removeClass()
    $('#category').removeClass()
    $('#sentiment').removeClass()
    $('#dictionary').removeClass()
    $('#employee').removeClass()
    $('#content').removeClass()
    $('#blog').addClass('active-menu')
}

// B. Change title and subtitle
function setBlogTitle() {
    console.info('setTitle')
    $('#title').html('Beheren blogs')
    $('#subtitle').html('Schrijf en beheer hier uw artikel')
}

// C. Get Search results from MongoDB if no results are available show form
function getBlogResults(user) {

    //1. Form search for word
    $('#contentElement').html(
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<h4 style="margin-bottom: 25px; text-align: left">Zoeken content</h4>' +
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
                url: '/admin/getBlogResults',
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

    //3. add Employee form results when press + button
    $('#cmdEmployeeForm').click(function () {
        console.info('cmdEmployeeForm')

        $.ajax({
            url: '/admin/getBlogEmployees',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.info(response)

                $('#contentElement').html(addBlogForm(response.employees))
                CKEDITOR.replace('txtArtikel')

                $('#cmdAddBlog').click(function () {

                    var titel = $('#txtTitel').val()
                    var chanel = $('#selChanel option:selected').text()
                    var auteur = $('#selEmployee option:selected').text()
                    var artikel = CKEDITOR.instances['txtArtikel'].getData()


                    console.info(titel)
                    console.info(chanel)
                    console.info(auteur)
                    console.info(artikel)

                    $.ajax({
                        url: '/admin/addBlogResults',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({titel: titel, chanel: chanel, auteur:auteur, artikel: artikel}),
                        success: function (response) {

                        }})
                })
            }
        })
    })
}


// 2.A. Update row to editable fields
function updateBlogField(name) {
    $.ajax({
        url: '/admin/getBlogResultsForm',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({name: name}),
        success: function (response) {
            console.info(response)

            //3 Show results
            $('#contentElement').html('')
            $('#contentElement').html(response.form)
            console.info(response.content)

            CKEDITOR.replace('txtBlog')
            CKEDITOR.instances['txtBlog'].setData(response.content)

            $('#cmdAddBlog').click(function () {

                var titel = $('#txtTitel').val()
                var chanel = $('#selChanel option:selected').text()
                var auteur = $('#selEmployee option:selected').text()
                var artikel = CKEDITOR.instances['txtContent'].getData()

                console.info(titel)


                $.ajax({
                    url: '/admin/saveBlogResults',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({name: name, section: section, content: CKEDITOR.instances['txtContent'].getData()}),
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

 function addBlogForm (employees) {

     var chanel = '<select id="selChanel">' +
         '<option value="LinkedIn">LinkedIn</option>' +
         '<option value="Facebook">Facebook</option>' +
         '<option value="Instagram">Instagram</option>' +
         '<option value="Twitter">Twitter</option>' +
         '<option value="SQL-Central">SQL-Central</option>' +
         '</select>'

     console.info(chanel)

     var auteur = ''
     employees.forEach(function (r) {
         auteur = auteur + '<option value="'+ r.firstname  +' '+  r.lastname + '">' + r.firstname  +' '+  r.lastname + '</option>'
     })

     console.info(auteur)

     var addBlogform =
         '<div class="row">'+
         '<div class="col-md-12">'+
         '<div class="form-group">' +
         '<label for="Titel">Titel</label>' +
         '<input type="text" class="form-control" id="txtTitel" placeholder="Titel">' +
         '</div>'+
         '</div>' +
         '</div>' +
         '<div class="row">'+
         '<div class="col-md-12">'+
         '<div class="form-group">' +
         '<label for="Publicatie kanaal">Publicatie kanaal</label>' +
         '</div>'+
         '</div>'+
         '</div>' +
         '<div class="row">'+
         '<div class="col-md-12">'+
         chanel +
         '</div>'+
         '</div>' +
         '<div class="row">'+
         '<div class="col-md-12">'+
         '<div class="form-group">'+
         '<label for="Auteur">Auteur</label>' +
         '</div>'+
         '</div>' +
         '</div>' +
         '<div class="row">'+
         '<div class="col-md-12">'+
         '<select id="selEmployee">' +
         auteur +
         '</select>' +
         '</div> ' +
         '</div>' +
         '<div class="row">'+
         '<div class="col-md-12">'+
         '<div class="form-group">' +
         '<label for="Artikel">Artikel</label>' +
         '<div id="txtArtikel"></div>'+
         '<div><button class="btn btn-primary btn-flat" id="cmdAddBlog">Opslaan</button></div>' +
         '</div>' +
         '</div>' +
         '</div>'


return addBlogform
}










