/**
 * Created by erik on 4/9/18.
 */
function addCVPeronaliaForm(cv) {
    if(!cv){

        var formPersonalia =
                    '<div class="tab-pane active fade in" id="tab1"> ' +
                        '<div class="row margin-bottom-10" id="frmPersonalia"> ' +
                            '<div class="col-md-6"> ' +
                                '<div class="row"> ' +
                                    '<div class="form-group col-md-6"> ' +
                                        '<label for="Voornaam">Voornaam</label> ' +
                                        '<input type="text" class="form-control" name="txtVoornaam" id="txtVoornaam" placeholder="Voornaam"> ' +
                                '</div> ' +
                                '<div class="form-group col-md-6"> ' +
                                    '<label for="Achternaam">Achternaam</label> ' +
                                    '<input type="text" class="form-control" name="txtAchternaam" id="txtAchternaam" placeholder="Achternaam"> ' +
                                '</div> ' +
                                '<div class="form-group col-md-12"> ' +
                                    '<label for="Titel">Titel</label> ' +
                                    '<input type="text" class="form-control" name="txtTitel" id="txtTitel" placeholder="Titel"> ' +
                                '</div> <div class="form-group col-md-12"> ' +
                                    '<label for="Woonplaats">Woonplaats</label> ' +
                                    '<input type="text" class="form-control" name="txtWoonplaats" id="txtWoonplaats" placeholder="Woonplaats"> ' +
                                '</div> ' +
                            '</div> ' +
                        '</div> ' +
                        '<div class="col-md-6"> ' +
                            '<h3>Personal Info</h3> ' +
                               '<p></p> </div> </div> </div>'

        var next =  '<a href="#" class="btn btn-default" id="savePersonalia">Volgende <i class="fa fa-long-arrow-right"></i></a>'

    }
    else {
        var formPersonalia =
            '<div class="tab-pane active fade in" id="tab1"> ' +
            '<div class="row margin-bottom-10"> ' +
            '<div class="col-md-6"> ' +
            '<div class="row"> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Voornaam">Voornaam</label> ' +
            '<input type="text" class="form-control" name="txtVoornaam" id="txtVoornaam" placeholder="Voornaam" value="'+ cv.voornaam  +'"> ' +
            '</div> ' +
            '<div class="form-group col-md-6"> ' +
            '<label for="Achternaam">Achternaam</label> ' +
            '<input type="text" class="form-control" name="txtAchternaam" id="txtAchternaam" placeholder="Achternaam" value="'+ cv.achternaam  +'"> ' +
            '</div> ' +
            '<div class="form-group col-md-12"> ' +
            '<label for="Titel">Titel</label> ' +
            '<input type="text" class="form-control" name="txtTitel" id="txtTitel" placeholder="Titel" value="'+ cv.titel  +'"> ' +
            '</div> <div class="form-group col-md-12"> ' +
            '<label for="Woonplaats">Woonplaats</label> ' +
            '<input type="text" class="form-control" name="txtWoonplaats" id="txtWoonplaats" placeholder="Woonplaats" value="'+ cv.woonplaats  +'" > ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '<div class="col-md-6"> ' +
            '<h3>Personal Info</h3> '  +
                '<p></p> </div> </div> </div>'


            var next =  '<a href="#" class="btn btn-default" id="updatePersonalia">Volgende <i class="fa fa-long-arrow-right"></i></a>'


    }



    return formPersonalia + next
}

