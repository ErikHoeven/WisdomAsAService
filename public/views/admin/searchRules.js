/**
 * Created by erik on 3/24/18.
 */


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
    $.ajax({
        url: '/admin/getSearchResults',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.info(response)
            if (response.count == 0 ){
                //1. Form show
                $('#contentElement').html('<div class=\"container\"><div class=\"col-md-5\"><div class=\"form-area\"><br style=\"clear:both\"><h4 style=\"margin-bottom: 25px; text-align: left;\">Toevoegen zoeken criteria<\/h4><div class=\"form-group\"><input type=\"text\" class=\"form-control\" id=\"name\" name=\"name\" placeholder=\"Name\" required><button type=\"button\" id=\"add\" name=\"add\" class=\"btn btn-primary pull-left\">Toevoegen<\/button><\/form><\/div><\/div><\/div>')

                //2. add search criteria when press add
                $('#add').click(function () {
                    var searchName =  $('#name').val()

                    addSearchCriteria(searchName)
                })
            }
            else {
                console.info(response.businessrules)
                $('#contentElement').html('')
                var table = '<table class="table table-hover">' + response.header + response.body + '</table>'
                $('#contentElement').html(table)

            }}})}

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
