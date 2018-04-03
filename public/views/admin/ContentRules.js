 // A. change menu Dictionario to red and the rest blue.
function selectContentMenu() {
    console.info('setMenu')
    $('#search').removeClass()
    $('#home').removeClass()
    $('#category').removeClass()
    $('#sentiment').removeClass()
    $('#dictionary').removeClass()
    $('#employee').removeClass()
    $('#content').addClass('active-menu')
}

// B. Change title and subtitle
function setContentTitle() {
    console.info('setTitle')
    $('#title').html('Beheren content')
    $('#subtitle').html('Beheer hier de texten voor de website')
}

// C. Get Search results from MongoDB if no results are available show form
function getContentResults(user) {

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
                url: '/admin/getContentResults',
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
}


// 2.A. Update row to editable fields
function updateContentField(name) {
    $.ajax({
        url: '/admin/getContentResultsForm',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({name: name}),
        success: function (response) {
            console.info(response)

            //3 Show results
            $('#contentElement').html('')
            $('#contentElement').html(response.form)
            console.info(response.content)

            CKEDITOR.replace('txtContent')
            CKEDITOR.instances['txtContent'].setData(response.content)


            $('#cmdSaveContent').click(function () {


                var name = $('#txtPageName').val()
                var section = $('#selSection option:selected').text()

                $.ajax({
                    url: '/admin/saveContentResults',
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
                    url: '/admin/getContentText',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({name: name, section: section}),
                    success: function (response) {
                        console.info(response)

                        CKEDITOR.instances['txtContent'].setData(response.content)

                    }
                })
            })
        }
    })
}










