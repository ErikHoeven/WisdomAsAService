/**
 * Created by root on 9-6-16.
 */

function getSimFormFields(){
    $(document).ready(function() {
        console.info("getSimFormFields");
        var aantalFormulieren =  $("#lstSimAantalFormulieren").val();
        var url               =  $("#txtSimURL").val();
        var logicalName       =  "";

        setFormProperties(aantalFormulieren,'Simulatie');
        return {aantalFormulieren: aantalFormulieren, url:url, name:logicalName }


});

function setFormProperties(aantalForms, element){
    console.info('setFormProperties');
    var htmlFormName =  '<div class="row">'
        +  '<div class="col-sm-3">'
         + '<label>Formulier naam:</label>'
         + '<input type="text" name="nameFormm" class="form-control"/>'
         + '</div></div>';

    var htmlFormFields =  '<div class="col-sm-3"><label>Aantal velden:'
        + '<select name="AantalVelden" id="AantalVelden" class="form-control">'
        + '<option>1</option>'
        + '<option>2</option>'
        + '<option>3</option>'
        + '<option>4</option>'
        + '<option>5</option>'
    + '</select>'
    + '</label>'
    +'</div></div>';

    $("#" + element).append(htmlFormName);
    $("#" + element).append(htmlFormFields)
}



}