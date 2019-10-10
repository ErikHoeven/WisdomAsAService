/**
 * Created by erik on 4/10/18.
 */
function formProfielBranche(cv) {
    if(!cv){

        var selectBranche = '<select id="selBranche">' +
            '<option value="Finance">Finance</option>'+
            '<option value="Logistiek">Logistiek</option>'+
            '<option value="Overheid">Overheid</option>'+
            '<option value="Telecom">Telecom</option>'+
            '<option value="Nuts">Nuts</option>'+
            '</select>'

        var formProfielBranche =
            '<div class="tab-pane active fade in" id="tab1"> ' +
                '<div class="row margin-bottom-10"> ' +
                    '<div class="col-md-6"> ' +
                        '<div class="row"> ' +
                            '<div class="form-group col-md-6"> ' +
                                '<label for="Branche">Branche</label> ' +
                                selectBranche +
                            '</div> ' +
                            '<div class="form-group col-md-12"> ' +
                                '<div id="txtProfielBranche"></div>'+
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                '<div class="col-md-6"> ' +
                    '<h4>Branche ervaring</h4> ' +
                    '<div id="tblBrancheErvaring"></div>' +
                '</div> ' +
            '</div>'

        var addBranche =  '<li class="next"><a href="#" class="btn btn-default" id="saveBrance">Opslaan Brance <i class="fa fa-long-arrow-right"></i></a></li>'

    }
    else {
        var selectBranche = '<select id="Branche">' +
            '<option value="Finance">Finance</option>'+
            '<option value="Logistiek">Logistiek</option>'+
            '<option value="Overheid">Overheid</option>'+
            '<option value="Telecom">Telecom</option>'+
            '<option value="Nuts">Nuts</option>'+
            '</select>'

        var formProfielBranche =
            '<div class="tab-pane active fade in" id="tab1"> ' +
            '<div class="row margin-bottom-10"> ' +
            '<div class="col-md-6"> ' +
            '<div class="row"> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Branche">Branche</label> ' +
            selectBranche +
            '</div> ' +
            '<div class="form-group col-md-12"> ' +
            '<div id="txtProfielBranche"></div>'+
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '<div class="col-md-6"> ' +
            '<h3>Branche samenvatting</h3> ' +
            '<div id="tblBrancheErvaring"></div>' +
            '</div> ' +
            '</div>'

        var addBranche =  '<li class="next"><a href="#" class="btn btn-default" id="saveBrance">Opslaan Brance <i class="fa fa-long-arrow-right"></i></a></li>'
    }

    return formProfielBranche + addBranche
}

function buildBrancheArray(newBranche, currentArray, brancheObject) {
    console.info('buildBrancheArray')
    var newBrancheArray = [], brancheHit = 0, brancheFind

    //Check if value exist in Array
    currentArray.forEach(function (r) {
        if(newBranche == r.branche){
            brancheHit = 1
        }
        if(newBranche != r.branche){
            brancheHit = 0
        }
    })

    //If value not exist then add object to the array
    if(brancheHit == 0){
        console.info('Branche does not exist')
        newBrancheArray = currentArray
        newBrancheArray.push(brancheObject)
    }

    // Else keep the array the same
    else{
        console.info('branche Exist')
        newBrancheArray = currentArray
        console.info(newBrancheArray)
    }

    return newBrancheArray
}

function tblBranche(bracheArray,editnr, id) {
    console.info('start  tblBranche')
    console.info(bracheArray)
    console.info(id)
    var  tblHeader ='<theader><th>Branche</th><th>Profiel samenvatting</th></theader>'
        ,tblBody = '<tbody>'
        ,table = '<table id="brancheTable" class="table table-hover">'

    if(!editnr) {
        for (var i = 0; i < bracheArray.length; i++) {
            tblBody = tblBody +
                '<tr>' +
                '<td id="' + i + '">' + bracheArray[i].branche + '</td>' +
                '<td id="' + i + '">' + bracheArray[i].brancheProfiel.substring(0,125) + ' .....</td>' +
                '<td id="del' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="removeBranche(\'' + id + '\',\'' + i + '\')"><span id="span"' + i + ' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                '</tr>'
        }
    }
    else{
        console.info('Editnr Exist')
        console.info(editnr)
        console.info(id)
        console.info(bracheArray)
        for (var i = 0; i < bracheArray.length; i++) {
            tblBody = tblBody +
                '<tr>' +
                '<td id="' + i + '">' + bracheArray[i].branche + '</td>' +
                '<td id="' + i + '">' + bracheArray[i].brancheProfiel.substring(0,125) + '.....</td>' +
                '<td id="del' + i + '"><button type="button" class="btn btn-default btn-sm" onclick="removeBranche(\'' + id + '\',\'' + i + '\')"><span id="span"' + i + ' class="glyphicon glyphicon-remove"></span> Remove</button></td>' +
                '</tr>'
        }
    }

    console.info(tblBody)
    return table = table + tblHeader + tblBody

}


function addBranche(brancheArrayCount,changeBrancheHit, brancheArray, changeHitBracheNummer, id){
    console.info('addBranche')
    console.info('saveBrance: ' + brancheArrayCount + ' :  ' + changeBrancheHit + ' : ' + id )
    console.info(brancheArray)
    if(changeBrancheHit == 0 ){
        var  branche = $('#selBranche option:selected').text()
            ,brancheProfiel = CKEDITOR.instances['txtProfielBranche'].getData()
            ,brancheObject = {nr: brancheArrayCount, branche:branche, brancheProfiel: brancheProfiel }

        brancheArray = buildBrancheArray(branche,brancheArray,brancheObject)
        console.info('ID BRANCHE')
        console.info('id addBranche: ' + id)
        var brancheTBL = tblBranche(brancheArray, null ,id)
        $('#tblBrancheErvaring').html(brancheTBL)

        brancheArrayCount++
    }
    else{
        console.info('ELSE BRANCHE')
        var newValue =  CKEDITOR.instances['txtProfielBranche'].getData()

        console.info(brancheArray)
        console.info(changeHitBracheNummer)
        brancheArray[changeHitBracheNummer].brancheProfiel = newValue
        console.info('ID BRANCHE')
        console.info('id addBranche: ' + id)
        var brancheTBL = tblBranche(brancheArray, null, id)
        $('#tblBrancheErvaring').html(brancheTBL)
    }

    return brancheArray
}

function changeBrange(brancheArray, changeHitBracheNummer) {
    console.info('changeBrange')
    var updBranche = $('#selBranche option:selected').text()
    console.info(brancheArray)

    if(_.where(brancheArray,{branche:updBranche})[0]){
        console.info('Value Exist in Array')

        var updProfileNr = _.where(brancheArray,{branche:updBranche})[0].nr
        var updProfile = _.where(brancheArray,{branche:updBranche})[0].brancheProfiel

        console.info(updProfileNr)
        CKEDITOR.instances['txtProfielBranche'].setData(updProfile)

        return {changeBrancheHit:  1,changeHitBracheNummer : updProfileNr}
    }
    else {
        console.info('New Value in Array')
        CKEDITOR.instances['txtProfielBranche'].setData('')

    }

}