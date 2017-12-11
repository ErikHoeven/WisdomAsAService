/**
 * Created by erik on 12/9/17.
 */
function getAllRFC(tickets, filter) {
    $.ajax({
        url: '/Dashboard/getRFC',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            console.info('succes get RFC')


            //getWordCloud('#wordcloud', wordCloud)
        }
    })




    filter.ticketType =  "Change"
    var dataset = _.where(ds,filter)
    var columns = Object.keys(ds[0])
    var rows = []
    var row = []



    return RFCList

}