/**
 * Created by erik on 3/24/18.
 */

/**
 * Created by erik on 3/24/18.
 */


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

// function addSearchCriteria(name, user) {
//     $.ajax({
//         url: '/admin/addSearchResults',
//         type: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify({name: name}),
//         success: function (response) {
//             console.info(response)
//             getSearchResults(user)
//         }
//     })}
//
 function updateCategoryField(id, Category, Color){
     console.info(id)
     console.info(Category)
     console.info(Color)
     $('#Cattegory' + id).html('<input type="text" id="editCategory' + id +'" placeholder="'+ Category +'"></input>')
     $('#Color' + id).html('<input type="text" value="' + Color + '" name="editColor"' + id +' id="editColor' + id  +'" autocomplete="off" style="background-image: none; background-color: rgb(15, 167, 194); color: rgb(0, 0, 0);">')
     $('#editColor' + id).addClass('jscolor{width:101, padding:0, shadow:false, borderWidth:0, backgroundColor:"transparent", insetColor:"#000"}')

     var field = 'edit' + id
     //console.info(field)
     $('#cmd' + id).html('')
     $('#cmd' + id).append('<button id="cmd'+ id+'" type="button" class="btn btn-default btn-sm" onclick="updateCategoryValue(\'' + id + '\',\'' + field + '\')"><span class="glyphicon glyphicon-save"></span> Edit</button>')

     $('#editColor' + id).focusout(function () {
         teller = teller + 1;
         console.info(teller)
         if (teller == 1 ){
             datasetvb = [];
             datasetvb.push({
                 color: "#" + $(this).val()
                 , label: $('#txtTagCattegory').val()
                 , value: 50
             });

             datasetvb.push({
                 color: "#333333"
                 , label: "Overige"
                 , value: 100
             });
             console.info(datasetvb);
         }
     });

     $('#editColor' + id).focusin(function () {
         console.info('focus in')
         teller = 0;
     });


 }
//
//
// function updateValue (id, field) {
//     var newValue = $('#' + field).val()
//     $.ajax({
//         url: '/admin/editSearchResults',
//         type: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify({id: id, field: 'lookupValue', value: newValue}),
//         success: function (response) {
//             console.info(response)
//             getSearchResults(user)
//         }
//     })}
//
//
// function removeValue(id) {
//     $.ajax({
//         url: '/admin/removeSearchResults',
//         type: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify({id: id}),
//         success: function (response) {
//             console.info(response)
//             getSearchResults(user)
//         }
//     })}
