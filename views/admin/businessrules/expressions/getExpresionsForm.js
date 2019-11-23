var async = require('async'),
    db = require('monk')('localhost/commevents'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    _ = require('underscore')

exports.getExpresionForm = function(req, res, next) {
    console.info('------------  getExpresionForm------------------------')
    console.info('')
    var expresionRuleForm = expresionFormStructure('complete')

    res.status(200).json({expresionRuleForm});
}

exports.getMultiRowExpresionForm = function(req, res, next) {
    console.info('------------------------- getMultiRowExpresionForm -------------------------')
    console.info('')
    var ScenarioName = req.body.ScenarioName
    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            function (callback) {
                db.collection('inkomstenbelasting').find({ScenarioName:ScenarioName}).toArray(function (err, Businessrules) {
                    if (err) return callback(err);
                    locals.Businessrules = Businessrules;
                    callback();
                })
            }
        ]
        async.parallel(tasks, function (err) {
           if (err) return next(err);
            db.close();

            var form = buildform(locals.Businessrules)

            console.info('---->  result form')
            console.info(form)
            res.status(200).json({message: form, ExpresionDefinition: locals.Businessrules[0].Expresions[0].ExpresionDefinition});
        })
    })
}

function buildform(businessrulesobject) {
    console.info('buildform')
    console.info(businessrulesobject[0].Expresions[0])
    var header = expresionFormStructure('header') + expresionFormStructure('')

    console.info('                  -------------------------- buildform -------------------------------')
    var expresionItems = businessrulesobject[0].Expresions[0].ExpresionLines
    var ExpresionDefinitionValue = businessrulesobject[0].Expresions[0].ExpresionDefinition
    var body = ''
    console.info('expresionItems.length: '+ expresionItems.length)


    if(expresionItems.length > 1) {
        console.info('Business Rule bestaat, voeg expresie toe')
        for (i = 0; i < expresionItems.length; i++) {
            console.info('          -------------------------------------')
            console.info('          Start Loop Iteration: ' + i)
            console.info('          ' +ExpresionDefinitionValue)
            console.info('          parameters:')
            console.info(expresionItems[i].expresionItemOperator)
            console.info(expresionItems[i].expresionItemValue)
            console.info('          -------------------------------------')


            body = body + expresionFormStructure('edit',ExpresionDefinitionValue
                                                    ,expresionItems[i].expresionItemName
                                                    ,expresionItems[i].expresionItemValue
                                                    ,expresionItems[i].expresionItemCattegory
                                                    ,expresionItems[i].expresionItemOperator
                                                    ,expresionItems[i].expresionItemPosition
                                                    ,i
                                                    )
            console.info('')
            console.info('Einde Loop ')
        }

        header =  expresionFormStructure('header-edit',ExpresionDefinitionValue) + expresionFormStructure('')
    }
    else {

        console.info('-----------------------------------------------')
        console.info('Business Rule bestaat niet, voeg business rule toe')
        console.info(expresionItems[0])
        console.info('-----------------------------------------------')
        //console.info(expresionItems)
        body = body + expresionFormStructure('edit', ExpresionDefinitionValue, expresionItems[0].expresionItemName,expresionItems[0].expresionItemValue,expresionItems[0].expresionItemCattegory,expresionItems[0].expresionItemOperator,expresionItems[0].expresionItemPosition,0)
        header =  expresionFormStructure('header-edit',ExpresionDefinitionValue) + expresionFormStructure('')

    }

    //console.info(header + body)


    return header + body + '</table></div>'
}



function expresionFormStructure(option, ExpresionDefinitionValue, ExprName, expresionValue, expresionCattegory,expresionOperator,expresionPosition,iteration) {
    console.info('----------------------------- expresionFormStructure: ' +  option    + '--------------'  +  iteration +'-------------- ')
    console.info(option)
    console.info(expresionOperator)
    console.info(expresionCattegory)

    console.info('---------------------------------------------------------------------------------- ')

    var result = ''
    var expresionPlaceholder  = '<div class=\"col-lg-12\">'
        + '<div class="expresionrules-form">'
        + '<table>'
    var expresionClosing = '</table>'

    var ExpresionDefinition = '<tr>'
        + '<td class="table-expresion">'
        + '<label class="col-form-label">Expresion Definition:</label>'
        + '</td>'
        + '</tr>'

        +'<tr>'
        + '<td class="table-expresion">'
        + '<input type="text" id="ExprDefinition" size="10"></input>'
        + '</td>'
        +'</tr>'


    var expresionRuleHeaders = '<tr>'
        + '<td class="table-expresion">'
        + '<label class="col-form-label">Name:</label>'
        + '</td>'
        + '<td class="table-expresion">'
        + '<label class="col-form-label">Value:</label>'
        + '</td>'
        + '<td class="table-expresion">'
        + '<label class="col-form-label">Rule:</label>'
        + '</td>'
        + '<td class="table-expresion">'
        + '<label class="col-form-label">Operator:</label>'
        + '</td>'
        + '<td class="table-expresion">'
        + '<label class="col-form-label">Position:</label>'
        + '</td>'
        + '</tr>'

     var expresionRuleForm = '<tr>'
        + '<td class="table-expresion">'
        + '<input type="text" id="ExprName" size="10"></input>'
        + '</td>'
        + '<td class="table-expresion">'
        + '<input type="text" id="expresionValue" size="10" ></input>'
        + '</td>'
        + '<td class="table-expresion">'
        + '<select id="expresionCattegory" onchange="formGetVairable()"><option value="Value">Value</option><option value="Variable">Variable</option><option value="Operator">Operator</option> +</select>'
        + '</td>'
        + '<td class="table-expresion">'
        + '<select id="expresionOperator" ><option value="*">*</option><option value="+">+</option><option value="-">-</option><option value="None">None</option></select>'
        + '</td>'
        + '<td class="table-expresion">'
        + '<input type="text" id="expresionPosition" size="5"></input>'
        + '</td>'
        + '<td class="table-expresion">'
        + '<button type="button" class="btn btn-primary" id="saveExpresion">Add</button>'
        + '</td>'
         + '</td>'
         + '<td class="table-expresion">'
         + '<button type="button" class="btn btn-primary" id="cmdClcExpresion">Calulate Expresion</button>'
         + '</td>'
         + '</div>'
        + '</tr>'

        var expresionRuleFormEdited = '<tr>'
            + '<td class="table-expresion">'
            + '<input type="text" id="ExprName_' + iteration + '" value="' + ExprName + '" size="10" disabled>'
            + '</td>'
            + '<td class="table-expresion">'
            + '<input type="text"  id="expresionValue_' + iteration + '" value="' + expresionValue + '" size="10" disabled>'
            + '</td>'
            + '<td class="table-expresion">'
            + '<input type="text"  id="expresionCattegory_' + iteration + '" value="' + expresionCattegory + '" size="10" disabled>'
            + '</td>'
            + '<td class="table-expresion">'
            + '<input type="text"  id="expresionOperator_' + iteration + '" value="' + expresionOperator + '"size="10" disabled>'
            + '</td>'
            + '<td class="table-expresion">'
            + '<input type="text"  id="expresionPosition_' + iteration + '" value="' + expresionPosition + '" size="5" disabled>'
            + '</td>'
            + '<td class="table-expresion">'
            + '</td>'
            + '</tr>'

    var ExpresionDefinitionEdit = '<tr>'
        + '<td class="table-expresion">'
        + '<label class="col-form-label">Expresion Definition:</label>'
        + '</td>'
        + '</tr>'

        +'<tr>'
        + '<td class="table-expresion">'
        + '<input type="text" id="ExprDefinition" value='+ ExpresionDefinitionValue  +' size="15" disabled></input>'
        + '</td>'
        +'</tr>'


    if (option == 'edit') {
        console.info('iteration edited: ' + iteration)
        console.info(expresionOperator)
        console.info(ExpresionDefinitionValue)
        console.info(expresionRuleFormEdited)
        result = expresionRuleFormEdited
    }
    if (option == 'header') {
        result = expresionPlaceholder + ExpresionDefinition + expresionRuleHeaders + expresionRuleForm
    }

    if (option == 'complete'){
        result = expresionPlaceholder + ExpresionDefinition + expresionRuleHeaders +  expresionRuleForm +  expresionClosing
    }

    if (option == 'header-edit') {
        console.info('header-edit')
        result = expresionPlaceholder + ExpresionDefinitionEdit + expresionRuleHeaders + expresionRuleForm
    }

    return result
}