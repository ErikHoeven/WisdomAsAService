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
        if(row.values.length == 1 && row.values[0]['State'] == 'Solved'){
            row.Weeknumber = moment(row.values[0]['Creation Date'],"YYYY-MM-DD HH:mm:ss").week()

            var CreationDate = row.values[0]['Creation Date'] , lastChange = row.values[0]['lastChange']


            row.leadTime   = moment(moment(lastChange,"YYYY-MM-DD HH:mm:ss").diff(moment(CreationDate,"YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss")
        }
    })

    console.info(countPerTicket)

}