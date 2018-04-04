/**
 * Created by erik on 3/24/18.
 */

 // A. change menu Dictionario to red and the rest blue.
function selectEmployeeMenu() {
    console.info('setMenu')
    $('#search').removeClass()
    $('#home').removeClass()
    $('#category').removeClass()
    $('#sentiment').removeClass()
    $('#dictionary').removeClass()
    $('#employee').addClass('active-menu')
    $('#content').removeClass()
    $('#blog').removeClass()
}

// B. Change title and subtitle
function setEmployeeTitle() {
    console.info('setTitle')
    $('#title').html('Medewerker instellingen')
    $('#subtitle').html('Voeg hier medewerker toe')
}

// C. Get Search results from MongoDB if no results are available show form
function getEmployeeResults(user) {

    //1. Form search for word
    $('#contentElement').html(
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<h4 style="margin-bottom: 25px; text-align: left">Zoeken personen</h4>' +
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
        '<div id="tblEmployeeResults">' +
        '</div>' +
        '</div>'
    )

    // 2. Search on term
    $("#txtSearchWord").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/admin/getEmployeeResults',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({term: request.term}),
                success: function (response) {
                    //3 Show results
                    $('#tblEmployeeResults').html('')
                    var table = '<table class="table table-hover">' + response.header + response.body + '</table>'
                    $('#tblEmployeeResults').html(table)
                    selectEmployeeMenu()
                    setEmployeeTitle()
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            log("Selected: " + ui.item.value + " aka " + ui.item.id);
        }
    });

    //3. add Employee form results when press + button
    $('#cmdEmployeeForm').click(function () {
        var form = '<div class="row">'+
            '<div class="col-md-6">'+
            '<div class="c_panel">' +
            '<div class="clearfix"></div>' +
            '</div><!--/.c_title-->' +
            '<div class="c_content">' +
            '<div class="form-group">' +
                '<label for="Voornaam">Voornaam</label>' +
                '<input type="text" class="form-control" id="txtFirstName" placeholder="Voornaam">' +
            '</div>'+
            '<div class="form-group">' +
            '<label for="Achternaam">Achternaam</label>' +
            '<input type="text" class="form-control" id="txtLastName" placeholder="Achternaam">' +
            '</div>'+
            '<div class="form-group">'+
                '<select id="selRole">' +
                    '<option value="Scrum master">Scrum master</option>' +
                    '<option value="Developer">Developer</option>' +
                    '<option value="Product Owner">Product Owner</option>' +
                    '<option value="Tester">Tester</option>' +
                    '<option value="Architect">Architect</option>' +
                '</select>' +
            '</div> ' +
            '<div class="form-group">' +
            '<label for="PercentageFullTime">Percentage fulltime</label>' +
            '<input type="text" class="form-control" id="txtPercFulltime" placeholder="percentage fulltime">' +
            '</div>'+
            '<div>' +
                '<button class="btn btn-primary btn-flat" id="cmdAddWoord">Opslaan</button>' +
            '</div>' +
        '</div>' +
        '</div>'
        '</div>'
        '</div>'

        $('#contentElement').html(form)

        $('#cmdAddWoord').click(function () {
            console.info('cmdAddWoord')

            var firstname = $('#txtFirstName').val()
                ,lastname = $('#txtLastName').val()
                ,percFullTime = $('#txtPercFulltime').val()
                ,role = $('#selRole option:selected').text()

            addEmployeeResults(firstname, lastname,role, percFullTime, user)
        })
    })
}
// 2.A. Update row to editable fields
function updateEmployeeField(id, firstname, lastname, role, percFullTime){
    var option = '<select id="editSelRole'+ id +'">' +
        '<option value="Scrum master">Scrum master</option>' +
        '<option value="Developer">Developer</option>' +
        '<option value="Product Owner">Product Owner</option>' +
        '<option value="Tester">Tester</option>' +
        '<option value="Architect">Architect</option>' +
        '</select>'


    $('#firstname' + id).html('<input type="text" id="editFirstname' + id +'" placeholder="'+ firstname +'"></input>')
    $('#lastname' + id).html('<input type="text" id="editLastName' + id +'" placeholder="'+ lastname +'"></input>')
    $('#role' + id).html(option)
    $('#percFullTime' + id).html('<input type="text" id="editPercFullTime' + id +'" placeholder="'+ percFullTime +'"></input>')

    $('#edit' + id).html('')
    $('#edit' + id).append('<button id="cmd'+ id+'" type="button" class="btn btn-default btn-sm" onclick="updateEmployeeValue(\'' + id + '\')"><span class="glyphicon glyphicon-save"></span> Edit</button>')
}

  function addEmployeeResults(firstname, lastname,role, percFullTime, user) {
    console.info({firstname: firstname, lastname: lastname, role: role, percFullTime: percFullTime })
     $.ajax({
         url: '/admin/addEmployeeResults',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify({firstname: firstname, lastname: lastname, role: role, percFullTime: percFullTime }),
         success: function (response) {
             console.info(response)
             getEmployeeResults(user)
         }
     })
 }

 function updateEmployeeValue (id) {
     var  firstname = $('#editFirstname' + id).val()
         , lastname = $('#editLastName' + id).val()
         , role = $('#editSelRole' + id + ' option:selected').text()
         , percFullTime = $('#editPercFullTime' + id).val()

     var empObject = {
         "firstname": firstname,
         "lastname": lastname,
         "role": role,
         "percFullTime": percFullTime,
         "id": id
     }

     console.info(empObject)

    $.ajax({
         url: '/admin/editEmployeeResults',
         type: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(empObject),
         success: function (response) {
            console.info(response)
            getEmployeeResults(user)
     }})
}


function removeEmployeeValue(id) {
     $.ajax({
     url: '/admin/removeEmployeeResults',
     type: 'POST',
     contentType: 'application/json',
     data: JSON.stringify({id: id}),
     success: function (response) {
     console.info(response)
     getEmployeeResults(user)
    }
})}





