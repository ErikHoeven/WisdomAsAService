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
                    '<h3>Branche ervaring</h3> ' +
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
            '<h3>Branche ervaring</h3> ' +
            '<div id="tblBrancheErvaring"></div>' +
            '</div> ' +
            '</div>'

        var addBranche =  '<li class="next"><a href="#" class="btn btn-default" id="saveBrance">Opslaan Brance <i class="fa fa-long-arrow-right"></i></a></li>'


    }



    return formProfielBranche + addBranche
}
/*
var selectRol = '<select id="Role">' +
    '<option value="Informatie Analist">Informatie Analist</option>'+
    '<option value="ETL Developer">ETL Developer</option>'+
    '<option value="BI Architect">BI Architect</option>'+
    '<option value="Front End Developer">Front End Developer</option>'+
    '<option value="Lead Developer">Lead Developer</option>'+
    '</select>'*/
