/**
 * Created by erik on 4/16/18.
 */
function startCVProfiel(id, cv) {
    //initVars


    //Profiel form
    var profielBranche = formProfielBranche()
    var profielRole = formProfielRole()
    var cvWizzard =  addCVWizzard()

    $('#contentElement').html(cvWizzard + profielBranche + '<p>' + profielRole )

    $('#Personalia').removeClass()
    $('#Profiel').addClass('active')
    console.info('CV voor 149')
    console.info(cv)

    $('#Personalia').click(function () {
        console.info('Personalia')
        addCVPeronaliaForm(cv)
    })

    $('#Profiel').click(function () {
        console.info('Profiel')
        startCVProfiel(id,cv)
    })

    $('#Werkervaring').click(function () {
        console.info('Werkervaring')
        startCVWerkervaring(id)
    })

    $('#Opleiding').click(function () {
        console.info('Opleiding')
        startCVOpleiding(id)
    })

    $('#Vaardigheden').click(function () {
        console.info('Vaardigheden')
        startCVVaardigheden(id)
    })

    if( cv.roleProfiles ){
        roleArray = cv.roleProfiles
        var tableRole = tblRole(roleArray)
        $('#tblRolErvaring').html(tableRole)


    }
    if( cv.brancheProfiles ){
        brancheArray = cv.brancheProfiles
        var tableBranche = tblBranche(brancheArray)
        $('#tblBrancheErvaring').html(tableBranche)
    }


    CKEDITOR.replace('txtProfielBranche')
    CKEDITOR.replace('txtRole')

    //Profiel - Branche (add Branche )
    $('#saveBrance').click(function () {
        brancheArray = addBranche(brancheArrayCount,changeBrancheHit, brancheArray, changeHitBracheNummer)
    })

    //Profiel - Role (add Role )
    $('#saveRole').click(function () {
        roleArray = addRole(roleArrayCount,changeRoleHit, roleArray, changeHitRoleNummer)
    })

    //Profiel - Branche (change Branche )
    $('#selBranche').change(function () {
        var selBranche =  changeBrange(brancheArray, changeHitBracheNummer)
        if(selBranche){
            changeBrancheHit = selBranche.changeBrancheHit
            changeHitBracheNummer = selBranche.changeHitBracheNummer
        }
    })

    //Profiel - Role (change Role )
    $('#selRole').change(function () {
        var selRole = changeRole(roleArray,changeHitRoleNummer)
        if(selRole){
            changeRoleHit = selRole.changeRoleHit
            changeHitRoleNummer = selRole.changeHitRoleNummer
        }
    })

    //Save profile and next section
    $('#saveProfile').click(function () {
        saveProfiel(roleArray,brancheArray,id)
    })
}

function saveProfiel(roleProfiles, brancheProfiles, id) {

    $.ajax({
        url: '/admin/updateCVProfile',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({roleProfiles: roleProfiles, brancheProfiles: brancheProfiles, id : id }),
        success: function (response) {
            console.info(response)
            startCVWerkervaring(id)

        }
    })
}
