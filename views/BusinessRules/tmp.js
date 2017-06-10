/**
 * Created by erik on 6/4/17.
 */
//                    $.ajax({
//                        url: '/BusinessRules/showBusinessRules',
//                        type: 'POST',
//                        contentType: 'application/json',
//                        data: JSON.stringify({message: 'toevoegen Bijvoegelijknaamwoorden'}),
//                        success: function (response) {
//                            //var scoreSet = []
//                            var tableDefinition = {}
//                            tableDefinition.divTable = 'tblBusinessrules'
//                            tableDefinition.tableName = 'tblSentiment'
//                            tableDefinition.keyColumn = ['_id']
//                            tableDefinition.hideColumns = ['searchReturnValue','cattegoryValue','__v','search']
//                            tableDefinition.title = 'Business Rules'
//                            tableDefinition.editRow = 'Y'
//                            tableDefinition.isEditable = 'N'
//                            tableDefinition.sourceCollection = 'businessrules'
//                            createGenericTable(response, tableDefinition, 10, 0)
//                            //scoreSet = createSentimentTable(response, 'tblBusinessrules', 'tblSentiment', 'btnSentiment', 1)
//                        }
//                    });


$('#sentiment').click(function () {
    $.ajax({
        url: '/BusinessRules/saveBijvoegelijkeNaamwoorden',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({message: 'toevoegen Bijvoegelijknaamwoorden'}),
        success: function (response) {
            var scoreSet = []
            console.info(response)
            //createGeneric(response, 'tblBusinessrules', 'tblSentiment')
            scoreSet = createSentimentTable(response, 'tblBusinessrules', 'tblSentiment', 'btnSentiment', 1)
        }
    });
})



        $.ajax({
            url: '/BusinessRules/buildGenericTable',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({tableDefinition: tableDefinition, setPagnationStep: 10, setActualStep: 0 }),
            success: function (response) {
                console.info('succes')
            }
        });



        var tableDefinition = {}
        tableDefinition.divTable = 'tblBusinessrules'
        tableDefinition.tableName = 'tblSentiment'
        tableDefinition.keyColumn = ['_id']
        tableDefinition.hideColumns = ['searchReturnValue', 'cattegoryValue', '__v', 'search']
        tableDefinition.title = 'Business Rules'
        tableDefinition.editRow = 'Y'
        tableDefinition.isEditable = 'N'
        tableDefinition.sourceCollection = 'businessrules'