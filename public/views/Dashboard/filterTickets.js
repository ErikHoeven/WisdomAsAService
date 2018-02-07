/**
 * Created by erik on 9/12/17.
 */
function filterTickets(value, dataset, snapshot) {
    var   stockArray = []
        , stockObject = {}
        , filteredTickets = []


    if (value != null && dataset != null && snapshot != null) {

        if (value == 'All') {
            stockValue = dataset[0].snapshotDetails
        } else {
            stockValue = _.where(dataset[0].snapshotDetails, {responsibleGroup: value})
        }

        filteredTickets = stockValue
        stockValue.forEach(function (v) {
            stockObject = {}
            stockObject.IndCreated = v.IndCreated
            stockObject.IndProgress = v.IndProgress
            stockObject.IndSolved = v.IndSolved
            stockObject.IndStock = v.IndStock
            stockObject.key = snapshot
            stockArray.push(stockObject)
        })

        stockValue = d3.nest()
            .key(function (d) {
                return d.key
            })
            .rollup(function (v) {
                return {
                    'createdTickets': d3.sum(v, function (d) {
                        return d.IndCreated
                    }),
                    'ticketsInProgress': d3.sum(v, function (d) {
                        return d.IndProgress
                    }),
                    'ticketsSolved': d3.sum(v, function (d) {
                        return d.IndSolved;
                    }),
                    'ticketsInStock': d3.sum(v, function (d) {
                        return d.IndStock;
                    })
                };
            })
            .entries(stockArray)
        return {stockValue: stockValue, filteredTickets: filteredTickets}
    }
    else {
        return {stockValue: null, filteredTickets: null}
    }
}


