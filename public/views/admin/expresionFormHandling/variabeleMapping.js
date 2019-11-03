function formGetVairable() {
    console.info('formGetVairable')

    if ($('#expresionCattegory option:selected').text() == 'Variable'){
        console.info($('#expresionCattegory option:selected').text())
        $.ajax({
            url:
                '/admin/getBrVariable',
            type: 'POST',
            contentType: 'application/json',
            //data: JSON.stringify({srgBusinessRules: brNAme}),
            success: function (response) {
            console.info('response')
            console.info(response)
            $('#ExprName').replaceWith(response.message)
            }
        })
    }
    if($('#expresionCattegory option:selected').text() == 'Value'){
        $('#ExprName').replaceWith('<input type="text" id="ExprName" size="10"></input>')
        $('#ExpresionValue').replaceWith('<input type="text" id="ExpresionValue" size="10"></input>')
    }
    if($('#expresionCattegory option:selected').text() == 'Operator') {
        $('#ExprName').replaceWith('<input type="text" id="ExprName" size="10" disabled></input>')
        $('#ExpresionValue').replaceWith('<input type="text" id="ExpresionValue" size="10" disabled></input>')
    }
}

function formGetResult(brName){
    console.info('---- formGetResult ------ ')
    var brName = $('#ExprName option:selected').text()
    console.info(brName)
    $.ajax({
        url:
            '/admin/getBrResult',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({srgBusinessRules: brName}),
        success: function (response) {
            console.info(response.message.ExpresionCalc)
            $('#expresionValue').replaceWith('<input type="text" id="expresionValue" size="10" value="'+ response.message.ExpresionCalc +'" disabled></input>')
            $('#ExpresionValue').replaceWith('<input type="text" id="ExpresionValue" size="10" value="'+ response.message.ExpresionCalc +'" disabled></input>')
        }
    })


}