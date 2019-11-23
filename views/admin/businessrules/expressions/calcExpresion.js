'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    inkomstenbelasting = db.get('inkomstenbelasting')


exports.getBusinessRule = function(req, res, next) {
    console.info('------------------------- getExpresionLines -------------------------')
    var ScenarioName = req.body.ScenarioName
    console.info('parameter: ' + ScenarioName)

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
            var expresionResult = getExpresionLines(locals.Businessrules)
            var form = formResult(expresionResult)
            res.status(200).json({message: form, result: expresionResult});
        })
    })
}

function getExpresionLines(businessrules)
{
    console.info('getExpresionLines')
    var EpresionCalcDescription = ''
    var ExpresionCalc = 0
    var expresionLines = businessrules[0].Expresions[0].ExpresionLines
    console.info(expresionLines)
    var lastValuePostition = 0
    var lastOperator = ''
    var calculationObject = {}
    for (var i = 0; i < expresionLines.length;i++) {
        // (1) Start building expresion
        console.info('')
        console.info('----- iteration: ' + i + '--------')
        console.info('expresionLines[i].expresionCattegory: ' + expresionLines[i].expresionItemCattegory )
        console.info('lastValuePostition: ' + lastValuePostition)
        console.info('lastOperator: ' + lastOperator)
        console.info('ExpresionCalcDescription: ' + EpresionCalcDescription)
        console.info('ExpresionCalc: ' + ExpresionCalc)
        console.info('expresionLines[i].expresionPosition: ' + expresionLines[i].expresionItemPosition)
        console.info('----- iteration: ' + i + '--------')

        if ((expresionLines[i].expresionItemCattegory == 'Value' || expresionLines[i].expresionItemCattegory == 'Variable') && expresionLines[i].expresionItemPosition == 0 ){
            console.info('   -----first value ---')
            EpresionCalcDescription = EpresionCalcDescription + expresionLines[i].expresionItemValue
            ExpresionCalc = expresionLines[i].expresionItemValue
            lastValuePostition = lastValuePostition + 2
            }
        if (expresionLines[i].expresionItemPosition < lastValuePostition && expresionLines[i].expresionItemCattegory == 'Operator' ){
            console.info('-----  operator -----')
            console.info(expresionLines[i].expresionItemOperator)

            EpresionCalcDescription = EpresionCalcDescription + expresionLines[i].expresionItemOperator
            lastOperator = expresionLines[i].expresionItemOperator

        }
        if (expresionLines[i].expresionItemPosition == lastValuePostition && expresionLines[i].expresionItemCattegory == 'Value' || expresionLines[i].expresionItemCattegory == 'Variable'&& lastOperator == '*' ){
            console.info('calculation(*)')
            EpresionCalcDescription = EpresionCalcDescription + expresionLines[i].expresionItemValue
            ExpresionCalc = +ExpresionCalc  * +expresionLines[i].expresionItemValue
            lastValuePostition = lastValuePostition + 2
        }
        if (expresionLines[i].expresionItemPosition == lastValuePostition && expresionLines[i].expresionItemCattegory == 'Value' || expresionLines[i].expresionItemCattegory == 'Variable' && lastOperator == '+' ){
            console.info('calculation(+)')
            EpresionCalcDescription = EpresionCalcDescription + expresionLines[i].expresionItemValue
            ExpresionCalc = +ExpresionCalc  +  +expresionLines[i].expresionItemValue
            lastValuePostition = lastValuePostition + 2
            console.info(ExpresionCalc)
        }
        if (expresionLines[i].expresionItemPosition == lastValuePostition && expresionLines[i].expresionItemCattegory == 'Value' || expresionLines[i].expresionItemCattegory == 'Variable' && lastOperator == '-' ){
            console.info('calculation(-)')
            EpresionCalcDescription = EpresionCalcDescription + expresionLines[i].expresionItemValue
            ExpresionCalc = +ExpresionCalc  -  +expresionLines[i].expresionItemValue
            lastValuePostition = lastValuePostition + 2
        }

    }

    calculationObject.EpresionCalcDescription = EpresionCalcDescription
    calculationObject.ExpresionCalc = ExpresionCalc

    return calculationObject

}

function formResult(object) {

var resultForm =
    '<div class=\"col-lg-12\">' +
    '<div class="expresionResult-form">' +
        '<table>' +
            '<tbody>' +
            '<tr>'+
                '<td class="table-expresion">'+
                    '<label class="col-form-label">Calculation:</label>'+
                '</td>'+
                '<td class="table-expresion">'+
                    '<label class="col-form-label">Result:</label>'+
                '</td>'+
            '</tr>'+
            '<tr>'+
                '<td class="table-expresion">'+
                    '<input type="text" id="EpresionCalcDescription" size="10" value="'+ object.EpresionCalcDescription +'" disabled>'+
                '</td>'+
                '<td class="table-expresion">'+
                    '<input type="text" id="expresionValue" size="10" value="'+ object.ExpresionCalc +'" disabled>'+
                '</td>'+
                '<td class="table-expresion">'+
                    '<button type="button" class="btn btn-primary" id="saveCalculation">Save</button>'+
                '</td>'+
            '</tr>'+
            '</tbody>'+
        '</table>'+
    '</div>'
    '</div>'

    return resultForm
}