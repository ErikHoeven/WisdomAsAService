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
    $('#title').html('Business Rules instellingen')
    $('#subtitle').html('Stel hier de waarde in waarop gegroepeerd op de gevonden resultaten van uw social media kanalen')
}

// C. Get Search results from MongoDB if no results are available show form
function getBusinessResults(user) {

    //1. Form search for word
    $('#contentElement').html(
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<h4 style="margin-bottom: 25px; text-align: left">Zoeken Business Rules</h4>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-md-5">' +
        '<input type="text" class="form-control" id="txtBusinessRuleWord" name="txtBusinessRuleWord" placeholder="zoekterm">' +
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
    $("#txtBusinessRuleWord").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/admin/startbusinessrules',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({term: request.term}),
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
                var brNAme = $('#BrName').val()
                var brCattegoryName = $('#selectBrCattegory option:selected').text()
                console.info(brNAme)
                console.info(brCattegoryName)
                addExpresionRuleForm(brNAme, brCattegoryName)
                console.info('end add ExpresionRules')
            })
        }
    })
}
        

function addExpresionRuleForm (brNAme,brCattegoryName) {
    $.ajax({
        url:
            '/admin/getExpresionsForm',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({brNAme: brNAme, brCattegoryName: brCattegoryName}),
        success: function (response) {
            console.info(response)
            //$('#contentElement').html(response.businessRuleform)
            $('#contentElementDetails').html(response.expresionRuleForm)

            formGetVairable()


            $('#saveExpresion').click(function () {

                console.info('save')
                var expresionName = $('#ExprName').val()
                var expresionValue = $('#expresionValue').val()
                var expresionCattegory = $('#expresionCattegory option:selected').text()
                var expresionPosition =  $('#expresionPosition').val()
                var expresionValue = $('#expresionValue').val()
                var brNAme = $('#BrName').val()
                var brCattegoryName = $('#selectBrCattegory option:selected').text()
                var expresionOperator = $('#expresionOperator option:selected').text()

                var businessRuleObject = {  BusinessRule: brNAme,
                                            businessruleCattegory: brCattegoryName,
                                            expresions: [{  expresionName: expresionName,
                                                            expresionCattegory: expresionCattegory,
                                                            expresionValue: expresionValue,
                                                            expresionPosition: expresionPosition,
                                                            expresionOperator: expresionOperator}]}
                console.info('--> saveExpr<--')
                console.info(brNAme)
                saveExpresion(businessRuleObject,brNAme)


            })
        }
    })
}

function saveExpresion(businessRuleObject,brNAme) {
 console.info('----> saveExpresion')
 console.info(businessRuleObject)
    console.info(brNAme)
    console.info(businessRuleObject.BusinessRule)



    $.ajax({
        url:
            '/admin/saveExpresions',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({object: businessRuleObject, brNAme: businessRuleObject.BusinessRule}),
        success: function (response) {
            console.info('Loaded')
            var businessrule = $('#BrName').val()
            console.info(businessrule)
            getBusinessRuleResults(businessrule)
        }})
}

function getBusinessRuleResults(businessrule) {
    console.info('Get Results from database')
    console.info('parameter:' + businessrule)
    $.ajax({
        url:
            '/admin/getBusinessRule',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({srgBusinessRules: businessrule}),
        success: function (response) {
            $('#contentElementDetails').html(response.message)

            $('#saveExpresion').click(function () {

                console.info('save')
                var expresionName = $('#ExprName').val()
                var expresionValue = $('#expresionValue').val()
                var expresionCattegory = $('#expresionCattegory option:selected').text()
                var expresionPosition = $('#expresionPosition').val()
                var expresionValue = $('#expresionValue').val()
                var brNAme = $('#BrName').val()
                var brCattegoryName = $('#selectBrCattegory option:selected').text()
                var expresionOperator = $('#expresionOperator option:selected').text()

                var businessRuleObject = {
                    BusinessRule: brNAme,
                    businessruleCattegory: brCattegoryName,
                    expresions: [{
                        expresionName: expresionName,
                        expresionCattegory: expresionCattegory,
                        expresionValue: expresionValue,
                        expresionPosition: expresionPosition,
                        expresionOperator: expresionOperator
                    }]
                }
                saveExpresion(businessRuleObject)
            })

            $('#cmdClcExpresion').click(function () {
                console.info('cmdClcExpresion')
                brNAme = $('#BrName').val()
                calculateExpresion(brNAme)

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

function saveCaculationResult(brName, brResult) {
    console.info('saveCaculationResult')
    $.ajax({
        url:
            '/admin/saveCalculation',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({srgBusinessRules: brNAme, brResult: brResult}),
        success: function (response) {
            location.reload()
            addBusinessRuleForm()
        }
    })
}

function calculateExpresion(brName) {

    $.ajax({
        url:
            '/admin/calcExpresion',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({srgBusinessRules: brNAme}),
        success: function (response) {
            $('#contentElementResults').html(response.message)

            $('#saveCalculation').click(function () {
                console.info('saveCalculation')
                console.info(response.result)
                saveCaculationResult(brName,response.result)
            })
        }
    })
}