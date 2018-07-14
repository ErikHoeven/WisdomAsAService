/**
 * Created by erik on 4/16/18.
 */
function startCVProfiel(cv, user, id) {
    //initVars
    console.info('startCVProfiel')
    console.info(id)

    if(!cv){
       console.info('CV does not exist')
        var cv = getCVByID(id)
    }

    console.info(cv)

    //Profiel form
    var profielBranche = formProfielBranche()
    var profielRole = formProfielRole()
    var cvWizzard =  addCVWizzard()
    var changeBrancheHit = 0
    var brancheArrayCount = 0
    var brancheArray = []
    var changeHitBracheNummer = 0
    var roleArrayCount = 0
    var changeRoleHit = 0
    var roleArray = []
    var changeHitRoleNummer = 0
    var id  = cv._id

    console.info('ID:' + id)

    $('#contentElement').html(cvWizzard + profielBranche + '<p>' + profielRole )

    $('#Personalia').removeClass()
    $('#Profiel').addClass('active')
    console.info('CV voor 149')
    console.info(cv)

    $('#Personalia').click(function () {
        console.info('Personalia')
        console.info(cv)
        var personalia = addCVPeronaliaForm(cv)
        $('#contentElement').html(cvWizzard + personalia)

        $('#Profiel').click(function () {
            console.info('Profiel')
            console.info('id bij Cv:' + id)
            if(id){
                $.ajax({
                    url: '/admin/getCVByID',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({id: id}),
                    success: function (response) {
                        console.info('Found CV')
                        console.info(response)
                        var cv = response.cv[0]
                        console.info(cv)

                        console.info('ID:')
                        console.info(id)
                        startCVProfiel(cv,user, id)
                    }
                })
            }
            else{
                console.info('Profiel bestaat niet')
            }
        })
    })

    $('#Profiel').click(function () {
        console.info('Profiel')
        if(id){
            $.ajax({
                url: '/admin/getCVByID',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({id: id}),
                success: function (response) {
                    console.info(response)
                    var cv = response.cv[0]
                    startCVProfiel(cv,user, id)
                }
            })
        }
        else{
            console.info('Profiel bestaat niet')
        }
    })

    $('#Profiel').click(function () {
        console.info('Profiel')
        console.info(cv)
        console.info(user)
        console.info(id)
        startCVProfiel(cv, user, id)
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
        console.info('brancheProfiles exist')
        brancheArray = cv.brancheProfiles
        var tableBranche = tblBranche(brancheArray)
        $('#tblBrancheErvaring').html(tableBranche)
    }


    CKEDITOR.replace('txtProfielBranche')
    CKEDITOR.replace('txtRole')

    //Profiel - Branche (add Branche )
    $('#saveBrance').click(function () {
        console.info('saveBrancheArray Before')
        console.info(brancheArray)
        console.info('BrancheID:')
        console.info(id)
        brancheArray = addBranche(brancheArrayCount,changeBrancheHit, brancheArray, changeHitBracheNummer, id)
        brancheArrayCount++
        console.info('saveBrancheArray After')
        console.info(brancheArray)
        console.info(id)
        if(id){
            saveProfiel(roleArray,brancheArray,id)
        }
        else{
            console.info('CV ID ontbreekt')
        }

    })

    //Profiel - Role (add Role )
    $('#saveRole').click(function () {
        roleArray = addRole(roleArrayCount,changeRoleHit, roleArray, changeHitRoleNummer)
        roleArrayCount++
        saveProfiel(roleArray,brancheArray,id)
    })

    //Profiel - Branche (change Branche )
    $('#selBranche').change(function () {
        console.info('Change Branche')
        console.info(changeHitBracheNummer)
        var selBranche =  changeBrange(brancheArray, changeHitBracheNummer)
        if(selBranche){
            changeBrancheHit = selBranche.changeBrancheHit
            changeHitBracheNummer = selBranche.changeHitBracheNummer

            console.info(selBranche)
            console.info(changeBrancheHit)
            console.info(changeHitBracheNummer)
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
        console.info(roleArray)
        console.info(brancheArray)
        console.info(id)
        saveProfiel(roleArray,brancheArray,id)
    })
}

function saveProfiel(roleProfiles, brancheProfiles, id){

    $.ajax({
        url: '/admin/updateCVProfile',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({roleProfiles: roleProfiles, brancheProfiles: brancheProfiles, id : id }),
        success: function (response) {
            console.info(response)
            //startCVWerkervaring(id)

        }
    })
}

function  removeBranche(id,row) {
    // (1) Get CV from Database
    $.ajax({
        url: '/admin/getCVByID',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id : id }),
        success: function (response) {
            console.info(response)
            //startCVWerkervaring(id)

        }
    })
    
}

function getCVByID(id) {
    console.info('Start getCVByID')
    console.info(id)
    $.ajax({
        url: '/admin/getCVByID',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id}),
        success: function (response) {
            console.info('Response getCVByID')
            console.info(response)
            var cv = response.cv[0]
            return cv
        }
    })

}