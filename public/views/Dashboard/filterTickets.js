/**
 * Created by erik on 9/12/17.
 */
function filterTickets(value, dataset) {
    var returnArray = [], returnObject = {}

    dataset.forEach(function (r) {
        r.snapshotDate = moment(r.snapshotDate).format("DD-MM-YYYY")
    })


    if (value != 'All'){
        returnArray = _.where(dataset,{Group: value})

        var countsPerDay = d3.nest()
            .key(function (d) {
                return d.snapshotDate
            })
            .rollup(function (v) {
                return {
                    'cpf': d3.sum(v, function (d) {
                        return d['cpf']
                    }),
                    'esoft': d3.sum(v, function (d) {
                        return d['esoft'];
                    }),
                    'firstLine': d3.sum(v, function (d) {
                        return d['firstLine'];
                    }),
                    'infra': d3.sum(v, function (d) {
                        return d['infra'];
                    }),
                    'secondLineApps': d3.sum(v, function (d) {
                        return d['secondLineApps'];
                    }),
                    'cognos': d3.sum(v, function (d) {
                        return d['cognos'];
                    }),
                    'desktopVirtualisatie': d3.sum(v, function (d) {
                        return d['desktopVirtualisatie'];
                    }),
                    'srl': d3.sum(v, function (d) {
                        return d['srl'];
                    }),
                };
            })
            .entries(dataset)
    }



    else{
        returnArray = dataset

        console.info('returnArray')

        var countsPerDay = d3.nest()
            .key(function (d) {
                return d.snapshotDate
            })
            .rollup(function (v) {
                return {
                    'cpf': d3.sum(v, function (d) {
                        return d['cpf']
                    }),
                    'esoft': d3.sum(v, function (d) {
                        return d['esoft'];
                    }),
                    'firstLine': d3.sum(v, function (d) {
                        return d['firstLine'];
                    }),
                    'infra': d3.sum(v, function (d) {
                        return d['infra'];
                    }),
                    'secondLineApps': d3.sum(v, function (d) {
                        return d['secondLineApps'];
                    }),
                    'infra': d3.sum(v, function (d) {
                        return d['infra'];
                    }),
                    'cognos': d3.sum(v, function (d) {
                        return d['cognos'];
                    }),
                    'desktopVirtualisatie': d3.sum(v, function (d) {
                        return d['desktopVirtualisatie'];
                    }),
                    'srl': d3.sum(v, function (d) {
                        return d['srl'];
                    }),
                };
            })
            .entries(returnArray)
        var labels = Object.keys(countsPerDay[0].value)
            ,labelData = []
        labels.forEach(function (label) {
            labelData.push(countsPerDay[0].value[label])
        })
    }

    var aggCountsPerDayCattegory = returnArray
    var countsPerDayCattegory = d3.nest()
        .key(function (d) {
            return d.snapshotDate
        })
        .rollup(function (v) {
            return {
                countCreatedTickets: d3.sum(v, function (d) {
                    return d.countCreatedTickets;
                }),
                countOpenTickets: d3.sum(v, function (d) {
                    return d.countOpenTickets;
                }),
                countSolvedTickets: d3.sum(v, function (d) {
                    return d.countSolvedTickets;
                }),

            };
        })
        .entries(aggCountsPerDayCattegory)


    returnArray.forEach(function (r) {
        var d = moment(r.CreationDate).format('DD-MM-YYYY')
        r.CreationDate = d
    })

    var stock = 0, stockCalulations = [], stockValues = {}
    aggCountsPerDayCattegory = aggCountsPerDayCattegory.reverse()
    console.info('countsPerDayCattegory.length')
    console.info(countsPerDayCattegory)
        if (countsPerDayCattegory.length > 1){
        console.info('countsPerDayCattegory.length > 1')


        var countsPerDayCattegory =  _.sortBy(countsPerDayCattegory, function (o){ return moment(o.key,'DD-MM-YYYY')})
            countsPerDayCattegory = _.without(arr, _.findWhere(arr, {
                datum: "Invalid date"
            }));


        for(var i = 0; i < countsPerDayCattegory.length; i++ ){
            if (i == 0){

                stockCalulations.push({datum: countsPerDayCattegory[i].key, createdTickets: countsPerDayCattegory[i].value.countCreatedTickets, opentTickets: countsPerDayCattegory[i].value.countOpenTickets, ticketStock: 0 , solvedTickets: countsPerDayCattegory[i].value.countSolvedTickets })
                //stock = ( countsPerDayCattegory[i].value.countCreatedTickets + countsPerDayCattegory[i].value.countOpenTickets ) - countsPerDayCattegory[i].value.countSolvedTickets
            }
            if (i > 0){
                stock = ( countsPerDayCattegory[i-1].value.countCreatedTickets + countsPerDayCattegory[i-1].value.countOpenTickets + stock ) - countsPerDayCattegory[i-1].value.countSolvedTickets

                if (stock <= 0){
                    stock = 0
                }

                stockCalulations.push({datum:countsPerDayCattegory[i].key, createdTickets: countsPerDayCattegory[i].value.countCreatedTickets, opentTickets: countsPerDayCattegory[i].value.countOpenTickets, ticketStock: stock, solvedTickets: countsPerDayCattegory[i].value.countSolvedTickets })
            }
        }

            console.info('--------- Stock ---------------')
            console.info(stockCalulations)
            console.info('--------- Stock ---------------')

        stockValues = stockCalulations[stockCalulations.length-1]

            returnObject.stockValues = stockValues
            returnObject.fltrData = returnArray
            returnObject.countPerDay = countsPerDay

    }
    else {

            countsPerDayCattegory[0].value.ticketStock = stock
            countsPerDayCattegory[0].value.createdTickets = countsPerDayCattegory[0].value.countCreatedTickets
            countsPerDayCattegory[0].value.solvedTickets = countsPerDayCattegory[0].value.countSolvedTickets
            countsPerDayCattegory[0].value.openTickets = countsPerDayCattegory[0].value.countOpenTickets
            returnObject.stockValues = countsPerDayCattegory[0].value
            returnObject.fltrData = returnArray
            returnObject.countPerDay = countsPerDay

        }
        return returnObject
}