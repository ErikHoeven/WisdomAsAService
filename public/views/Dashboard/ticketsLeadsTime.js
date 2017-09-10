/**
 * Created by erik on 9/9/17.
 */


function ticketLeadTime(tickets) {
    console.info('------  ticketLeadTime  ------------')

    var ticketsWithLeadTime = []


    var countPerTicket = d3.nest()
        .key(function(d) { return d.Number; })
        .entries(tickets)


    countPerTicket.forEach(function (row) {
        if(row.values.length == 1){

        }


    })









}