 // A. change menu Zoek criteria red the rest blue.
function selectSearchMenu() {
    console.info('setMenu')
    $('#search').addClass('active-menu')
    $('#home').removeClass()
    $('#category').removeClass()
    $('#sentiment').removeClass()
    $('#dictionary').removeClass()
    $('#employee').removeClass()
    $('#content').removeClass()
    $('#blog').removeClass()
}

// B. Change title and subtitle
function setSearchTitle() {
    $('#title').html('Zoek instellingen')
    $('#subtitle').html('Stel hier de waarde in waarop gezocht wordt in uw social media kanalen')
}

// C. Get Search results from MongoDB if no results are available show form
function getSearchResults(user) {

    //1. Form search for word
    $('#contentElement').html(
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<h4 style="margin-bottom: 25px; text-align: left">Zoeken zoek criteria</h4>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<input type="text" class="form-control" id="txtSearchWord" name="txtSearchWord" placeholder="zoekterm">' +
        '</div>' +
        '<div class="col-md-5">' +
        '<button type="button" class="btn btn-primary btn-flat btn-raised btn-float" id="cmdSearchForm"><span class="fa fa-plus"></span></button>' +
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
                url: '/admin/getSearchResults',
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
    //3. add Search Criteria form results when press + button
    $('#cmdSearchForm').click(function () {
        console.info('cmdSearchForm')

        $('#contentElement').html(addSearchForm())

        //3.D Submit
        $('#addSearchValue').click(function () {
            var searchValue = $('#txtSearchValue').val()

            addSearchCriteria(searchValue, user)
        })
    })
}

function addSearchCriteria(name, user) {
    $.ajax({
        url: '/admin/addSearchResults',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({name: name}),
        success: function (response) {
            console.info(response)
            getSearchResults(user)
        }
    })}

function updateField(id, value){
    $('#' + id).html('<input type="text" id="edit' + id +'" placeholder="'+ value +'"></input>')
    var field = 'edit' + id
    console.info(field)
    $('#cmd' + id).html('')
    $('#cmd' + id).append('<button id="cmd'+ id+'" type="button" class="btn btn-default btn-sm" onclick="updateValue(\'' + id + '\',\'' + field + '\')"><span class="glyphicon glyphicon-save"></span> Edit</button>')
}


function updateValue (id, field) {
    var newValue = $('#' + field).val()
    $.ajax({
        url: '/admin/editSearchResults',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id, field: 'lookupValue', value: newValue}),
        success: function (response) {
            console.info(response)
            getSearchResults(user)
        }
    })}

function removeValue(id) {
    $.ajax({
        url: '/admin/removeSearchResults',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id}),
        success: function (response) {
            console.info(response)
            getSearchResults(user)
        }
    })}

function addSearchForm () {
    var searchForm =
        '<div class=\"col-lg-6\">' +
        '<div class="form-group">' +
        '<label>Zoek waarde</label>' +
        '<div class="input-group">' +
        '<input type="text" class="form-control" id="txtSearchValue" name="txtSearchValue" placeholder="search value">' +
        '</div>' +
        '</div><input type="submit" name="addSearchValue" id="addSearchValue" value="Toevoegen" class="btn btn-info pull-left">'

    return searchForm
}




