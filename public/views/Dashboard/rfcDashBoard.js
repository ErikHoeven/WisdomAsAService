/**
 * Created by erik on 12/9/17.
 */
function getAllRFC() {
   console.info('--------------  RFC -------------------------')

    $.ajax({
        url: '/Dashboard/getRFC',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            console.info('succes get RFC')
            console.info(data)

            var rfcValues = [], stockRFC = 0, stockRFCValues = {}
            rfcValues = filterTickets('All', data.aggCountsPerDayCattegory)
            console.info('-----------  Funnel RFC values------------')
            stockRFCValues = rfcValues.stockValues
            console.info(stockRFCValues)

            $('#createdRFC').text(stockRFCValues.createdTickets)
            $('#openRFC').text(stockRFCValues.countOpenTickets)
            $('#closedRFC').text(stockRFCValues.countSolvedTickets)
        }
    })

    return RFCList

}