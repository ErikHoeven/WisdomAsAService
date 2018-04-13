/**
 * Created by erik on 4/10/18.
 */
function formProfielRole(cv) {
    if(!cv){

     var selectRol = '<select id="selRole">' +
         '<option value="Informatie Analist">Informatie Analist</option>'+
         '<option value="ETL Developer">ETL Developer</option>'+
         '<option value="BI Architect">BI Architect</option>'+
         '<option value="Front End Developer">Front End Developer</option>'+
         '<option value="Lead Developer">Lead Developer</option>'+
         '</select>'

        var formProfielRole =
            '<div class="tab-pane active fade in" id="tab1"> ' +
                '<div class="row margin-bottom-10"> ' +
                    '<div class="col-md-6"> ' +
                        '<div class="row"> ' +
                            '<div class="form-group col-md-6"> ' +
                                '<label for="Rol">Rol</label> ' +
                                    selectRol +
                            '</div> ' +
                            '<div class="form-group col-md-12"> ' +
                                '<div id="txtRole"></div>'+
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                '<div class="col-md-6"> ' +
                    '<h4>Profiel Rol</h4> ' +
                    '<div id="tblRolErvaring"></div>' +
                '</div> ' +
            '</div>'

        var addRole =  '<div class="row"><div class="col-md-6"><a href="#" class="btn btn-default" id="saveRole">Opslaan Rol <i class="fa fa-long-arrow-right"></i></a></div>'
        var addProfile = '<div class="col-md-6" align="right"><a href="#" class="btn btn-default" id="saveProfile">Volgende<i class="fa fa-long-arrow-right"></i></a></div></div>'

    }
    else {
        var selectRol = '<select id="selRole">' +
            '<option value="Informatie Analist">Informatie Analist</option>'+
            '<option value="ETL Developer">ETL Developer</option>'+
            '<option value="BI Architect">BI Architect</option>'+
            '<option value="Front End Developer">Front End Developer</option>'+
            '<option value="Lead Developer">Lead Developer</option>'+
            '</select>'

        var formProfielRole =
            '<div class="tab-pane active fade in" id="tab1"> ' +
            '<div class="row margin-bottom-10"> ' +
            '<div class="col-md-6"> ' +
            '<div class="row"> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Rol">Rol</label> ' +
            selectRol +
            '</div> ' +
            '<div class="form-group col-md-12"> ' +
            '<div id="txtRole"></div>'+
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '<div class="col-md-6"> ' +
            '<h3>Role samenvatting</h3> ' +
            '<div id="tblRolErvaring"></div>' +
            '</div> ' +
            '</div>'

        var addRole =  '<li class="next"><a href="#" class="btn btn-default" id="saveRole">Opslaan Rol <i class="fa fa-long-arrow-right"></i></a></li>'
        var addProfile = '<li class="next"><a href="#" class="btn btn-default" id="saveProfile">Volgende<i class="fa fa-long-arrow-right"></i></a></li>'


    }

    return formProfielRole + addRole + addProfile
}

function buildRoleArray(newRole, currentArray, roleObject) {
    var newRoleArray = [], roleHit = 0, roleFind

    //Check if value exist in Array
    currentArray.forEach(function (r) {
        if(newRole == r.role){
            roleHit = 1
        }
        if(newRole != r.role){
            roleHit = 0
        }
    })

    //If value not exist then add object to the array
    if(roleHit == 0){
        newRoleArray = currentArray
        newRoleArray.push(roleObject)
    }

    // Else keep the array the same
    else{
        newRoleArray = currentArray
    }

    return newRoleArray
}

function tblRole(roleArray,editnr) {
    var  tblHeader ='<theader><th>Role</th><th>Rol samenvatting</th></theader>'
        ,tblBody = '<tbody>'
        ,table = '<table id="roleTable" class="table table-hover">'

    if(!editnr) {
        for (var i = 0; i < roleArray.length; i++) {
            tblBody = tblBody +
                '<tr>' +
                '<td id="' + i + '">' + roleArray[i].role + '</td>' +
                '<td id="' + i + '">' + roleArray[i].roleProfiel + '</td>' +
                '<td id="del' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="removeCategoryValue(\'' + i + '\')"><span id="span"' + i + ' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                '</tr>'
        }
    }

    return table = table + tblHeader + tblBody
}





function addRole(roleArrayCount,changeRoleHit, roleArray, changeHitRoleNummer) {
    console.info('saveRole: ' + roleArrayCount + ' :  ' + changeRoleHit )
    if(changeRoleHit == 0 ){
        var  role = $('#selRole option:selected').text()
            ,roleProfiel = CKEDITOR.instances['txtRole'].getData()
            ,roleObject = {nr: roleArrayCount, role:role, roleProfiel: roleProfiel }

        roleArray = buildRoleArray(role,roleArray,roleObject)
        var roleTBL = tblRole(roleArray)
        $('#tblRolErvaring').html(roleTBL)

        roleArrayCount++
    }
    else{
        console.info('ELSE ROLE')
        console.info(roleArray[changeHitRoleNummer].roleProfiel)
        console.info(changeHitRoleNummer)

        var newRoleValue =  CKEDITOR.instances['txtRole'].getData()

        roleArray[changeHitRoleNummer].roleProfiel = newRoleValue

        console.info(roleArray)


        var roleTBL = tblRole(roleArray)
        $('#tblRolErvaring').html(roleTBL)
    }

    return roleArray
}

function changeRole(roleArray, changeHitRoleNummer) {
    var updRole = $('#selRole option:selected').text()

    if(_.where(roleArray,{role:updRole})[0]){

        var updProfileNr = _.where(roleArray,{role:updRole})[0].nr
        var updProfile = _.where(roleArray,{role:updRole})[0].roleProfiel

        console.info(updProfileNr)
        CKEDITOR.instances['txtRole'].setData(updProfile)
        return {changeRoleHit : 1, changeHitRoleNummer : updProfileNr }
    }

}