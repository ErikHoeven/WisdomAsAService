// A. change menu Zoek criteria red the rest blue.
function selectBusinessRuleMenu() {
    console.info('setMenu')
    $('#search').removeClass()
    $('#home').removeClass()
    $('#category').removeClass()
    $('#sentiment').removeClass()
    $('#dictionary').removeClass()
    $('#employee').removeClass()
    $('#content').removeClass()
    $('#blog').removeClass()
    $('#cvBuilder').addClass()
    $('#businessRules').addClass('active-menu')
}

// B. Change title and subtitle
function setBusinessRuleTitle() {
    $('#title').html('Inkomsten belasting ondernemers:')
    $('#subtitle').html('Stel hier zelf de Scenarios, forumles en rekenregels samen')
}

// C. Get Search results from MongoDB if no results are available show form
function getBusinessResults(user) {

    //1. Form search for word
    $('#contentElement').html(
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<h4 style="margin-bottom: 25px; text-align: left">Zoeken Scenario inkomstenbelasting ondernemers:</h4>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<input type="text" class="form-control" id="txtRekenregel" name="txtRekenregel" placeholder="zoekterm">' +
        '</div>' +
        '<div class="col-md-5">' +
        '<button type="button" class="btn btn-primary btn-flat btn-raised btn-float" id="addBusinessRule"><span class="fa fa-plus"></span></button>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-12">' +
        '<div id="tblContentResults">' +
        '</div>' +
        '</div>'
    )

    // 2. Search on term
    $("#txtRekenregel").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/admin/zoekenRekenregels',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({Scenario: request.term}),
                success: function (response) {
                    console.info(response)
                    //3 Show results
                    $('#tblContentResults').html('')
                    var table = '<table class="table table-hover">' + response.header + response.body + '</table>'
                    $('#tblContentResults').html(table)
                }
            })
        },
        minLength: 2,
        select: function (event, ui) {
            log("Selected: " + ui.item.value + " aka " + ui.item.id);
        }
    })
    //3. add Cattegory form results when press + button
    $('#addBusinessRule').click(function () {
        console.info('start addBusinessRule')
        addBusinessRuleForm()

    })
}

//  SPECIFIC FUNCTIONS
function addBusinessRuleForm () {

    var tagCattegory = ''
    $.ajax({
        url:
            '/admin/getBusinessRulesCattegories',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tagCattegory: tagCattegory}),
        success: function (response) {
            $('#contentElement').html(response.businessRuleform)

            $('#cmdAddExpresion').click(function () {
                console.info('start add ExpresionRules')
                var ScenarioName = $('#ScenarioName').val()
                var InkomstenbelastingOnderdeel = $('#InkomstenbelastingOnderdeel option:selected').text()
                console.info(ScenarioName)
                console.info(InkomstenbelastingOnderdeel)
                addExpresionRuleForm(ScenarioName, InkomstenbelastingOnderdeel)
                console.info('end add ExpresionRules')
            })
        }
    })
}
        

function addExpresionRuleForm (ScenarioName,InkomstenbelastingOnderdeel) {
    $.ajax({
        url:
            '/admin/getExpresionsForm',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ScenarioName: ScenarioName, InkomstenbelastingOnderdeel: InkomstenbelastingOnderdeel}),
        success: function (response) {
            console.info(response)
            //$('#contentElement').html(response.businessRuleform)
            $('#contentElementDetails').html(response.expresionRuleForm)

            formGetVairable()


            $('#saveExpresion').click(function () {

                console.info(' save expresion')

                var businessRuleObject = {  ScenarioName: $('#ScenarioName').val(),
                                            InkomstenbelastingOnderdeel: $('#InkomstenbelastingOnderdeel option:selected').text(),
                                            OnderdeelPositie: $('#OnderdeelPositie').val(),
                                            Expresions: [{  ExpresionDefinition: $('#ExprDefinition').val(),
                                                            ExpresionLines:[{
                                                                expresionItemName: $('#ExprName').val(),
                                                                expresionItemCattegory: $('#expresionCattegory').val(),
                                                                expresionItemValue: $('#expresionValue').val(),
                                                                expresionItemPosition: $('#expresionPosition').val(),
                                                                expresionItemOperator: $('#expresionOperator option:selected').text()
                                                             }]
                                                        }]
                                            }
                console.info('--> saveExpr<--')
                console.info(ScenarioName)
                saveExpresion(businessRuleObject,$('#ScenarioName').val())


            })
        }
    })
}

function saveExpresion(businessRuleObject,ScenarioName) {
 console.info('----> saveExpresion')
 console.info(businessRuleObject)
    console.info(ScenarioName)
    console.info(businessRuleObject.ScenarioName)



    $.ajax({
        url:
            '/admin/saveExpresions',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({object: businessRuleObject, ScenarioName: businessRuleObject.ScenarioName}),
        success: function (response) {
            console.info('Loaded')
            console.info(response)
            var ScenarioName = $('#ScenarioName').val()
            // set the value of ExpresionDefinition
            console.info(ScenarioName)
            getBusinessRuleResults(ScenarioName, response.ExpresionDefinition)

        }})
}

function getBusinessRuleResults(ScenarioName, ExpresionDefinition) {
    console.info('Get Results from database')
    console.info('parameter:' + ScenarioName)

    $.ajax({
        url:
            '/admin/getBusinessRule',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ScenarioName: ScenarioName}),
        success: function (response) {
            $('#contentElementDetails').html(response.message)


            $('#saveExpresion').click(function () {
                console.info('Click Add -> Save Expresion to DB')
                var businessRuleObject = {  ScenarioName: $('#ScenarioName').val(),
                    InkomstenbelastingOnderdeel: $('#InkomstenbelastingOnderdeel option:selected').text(),
                    OnderdeelPositie: $('#OnderdeelPositie').val(),
                    Expresions: [{  ExpresionDefinition: $('#ExprDefinition').val(),
                        ExpresionLines:[{
                            expresionItemName: $('#ExprName').val(),
                            expresionItemCattegory: $('#expresionCattegory').val(),
                            expresionItemValue: $('#expresionValue').val(),
                            expresionItemPosition: $('#expresionPosition').val(),
                            expresionItemOperator: $('#expresionOperator option:selected').text()
                        }]
                    }]
                }
                sendExpresionToDB(businessRuleObject, $('#ScenarioName').val())
            })

            $('#cmdClcExpresion').click(function () {
                console.info('cmdClcExpresion')
                ScenarioName = $('#ScenarioName').val()
                calculateExpresion(ScenarioName)

                $('#saveCalculation').click(function () {
                    console.info('saveCalculation')
                    var calResult = saveCaculationResult(brNAme,brResult)
                    console.info('calcResult:')
                    console.info(calResult)
                })
            })

            $('#saveCalculation').click(function () {
                console.info('saveCalculation')
                var calResult = saveCaculationResult(brNAme,brResult)
                console.info('calcResult:')
                console.info(calResult)
            })
        }
    })
}

function saveCaculationResult(ScenarioName, brResult) {
    console.info('saveCaculationResult')
    $.ajax({
        url:
            '/admin/saveCalculation',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ScenarioName: ScenarioName, brResult: brResult}),
        success: function (response) {
            location.reload()
            addBusinessRuleForm()
        }
    })
}

function calculateExpresion(ScenarioName) {

    $.ajax({
        url:
            '/admin/calcExpresion',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ScenarioName: ScenarioName}),
        success: function (response) {
            $('#contentElementResults').html(response.message)

            $('#saveCalculation').click(function () {
                console.info('saveCalculation')
                console.info(response.result)
                saveCaculationResult(ScenarioName,response.result)
            })
        }
    })
}

function sendExpresionToDB(businessRuleObject,ScenarioName) {
    console.info('sendExpresionToDB')
    saveExpresion(businessRuleObject,ScenarioName)

}