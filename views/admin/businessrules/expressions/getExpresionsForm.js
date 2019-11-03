var async = require('async'),
    db = require('monk')('localhost/commevents'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    _ = require('underscore')

exports.getExpresionForm = function(req, res, next) {
    console.info('getExpresionForm')
    var expresionRuleForm = expresionFormStructure('complete')

    res.status(200).json({expresionRuleForm});
}

exports.getMultiRowExpresionForm = function(req, res, next) {
    console.info('------------------------- getInkomstenBelastingResults -------------------------')
    var srgBusinessRules = req.body.srgBusinessRules
    console.info('parameter: ' + srgBusinessRules)

    mongo.connect(uri, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            function (callback) {
                db.collection('inkomstenbelasting').find({BusinessRule:srgBusinessRules}).toArray(function (err, Businessrules) {
                    if (err) return callback(err);
                    locals.Businessrules = Businessrules;
                    callback();
                })
            }
        ]
        async.parallel(tasks, function (err) {
           if (err) return next(err);
            db.close();

            console.info(locals.Businessrules)
            var form = buildform(locals.Businessrules)

            console.info('---->  result form')
            console.info(form)
            res.status(200).json({message: form});
        })
    })
}

function buildform(businessrulesobject) {
    console.info('buildform')
    console.info(businessrulesobject[0].expresions)
    var header = expresionFormStructure('header') + expresionFormStructure('')
    var expresionItems = businessrulesobject[0].expresions
    var body = ''
    console.info('expresionItems.length: '+ expresionItems.length)


    if(expresionItems.length > 1) {
        console.info('Business Rule bestaat, voeg expresie toe')
        for (i = 0; i < expresionItems.length; i++) {
            console.info('Loop par')
            console.info(expresionItems[i])
            body = body + expresionFormStructure('edit',expresionItems[i].expresionName,expresionItems[i].expresionValue,expresionItems[i].expresionCattegory,expresionItems[i].expresionOperator,expresionItems[i].expresionPosition,i)
            console.info('Einde loop par')
        }
    }
    else {
        console.info('Business Rule bestaat niet, voeg business rule toe')
        console.info(expresionItems)
        body = body + expresionFormStructure('edit',expresionItems[0].expresionName,expresionItems[0].expresionValue,expresionItems[0].expresionCattegory,expresionItems[0].expresionOperator,expresionItems[0].expresionPosition,0)
        //body = body + expresionFormStructure('edit',expresionItems[i].expresionName,expresionItems[i].expresionValue,expresionItems[i].expresionCattegory,expresionItems[i].expresionOperator,expresionItems[i].expresionPosition,i)
    }

    //console.info(header + body)


    return header + body + '</table></div>'
}



function expresionFormStructure(option, ExprName, expresionValue, expresionCattegory,expresionOperator,expresionPosition,iteration) {
    console.info('----------------------------- expresionFormStructure ---------------------------- ')
    console.info(option)
    console.info('---------------------------------------------------------------------------------- ')

    var result = ''
    var expresionPlaceholder  = '<div class=\"col-lg-12\">'
        + '<div class="expresionrules-form">'
        + '<table>'
    var expresionClosing = '</table>'


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

    if (option == 'edit') {
        console.info('iteration edited: ' + iteration)
        console.info(expresionOperator)
        result = expresionRuleFormEdited
        console.info(expresionRuleFormEdited)
    }
    if (option == 'header') {
        result = expresionPlaceholder + expresionRuleHeaders + expresionRuleForm
    }

    if (option == 'complete'){
        result = expresionPlaceholder + expresionRuleHeaders +  expresionRuleForm +  expresionClosing
    }

    return result
}