/**
 * Created by erik on 9/12/17.
 */
function filterTickets(value, dataset) {
    var returnArray = [], returnObject = {}

    dataset.forEach(function (r) {
        if(r.snapshotDate){
            r.snapshotDate = moment(r.snapshotDate).format("DD-MM-YYYY")
        }
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
    if (countsPerDayCattegory.length > 1){
        console.info('countsPerDayCattegory.length > 1')
        var countsPerDayCattegory =  _.sortBy(countsPerDayCattegory, function (o){ return moment(o.key,'DD-MM-YYYY')})
        var newCountsPerDayCattegory = []

        countsPerDayCattegory.forEach(function (r) {
            if(r.key.length ==  10){
                newCountsPerDayCattegory.push(r)
            }
            else {
                console.info('ignore')
            }
        })



        newCountsPerDayCattegory.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return moment(a.key,'DD-MM-YYYY').toDate() - moment(b.key, 'DD-MM-YYYY').toDate();
        })

        console.info(newCountsPerDayCattegory)





        for(var i = 0; i < newCountsPerDayCattegory.length; i++ ){
            if (i == 0){

                stockCalulations.push({datum: newCountsPerDayCattegory[i].key, createdTickets: newCountsPerDayCattegory[i].value.countCreatedTickets, opentTickets: newCountsPerDayCattegory[i].value.countOpenTickets, ticketStock: 0 , solvedTickets: newCountsPerDayCattegory[i].value.countSolvedTickets })
                //stock = ( countsPerDayCattegory[i].value.countCreatedTickets + countsPerDayCattegory[i].value.countOpenTickets ) - countsPerDayCattegory[i].value.countSolvedTickets
            }
            if (i > 0 && newCountsPerDayCattegory[i].datum != "Invalid date" ){
                stock = ( newCountsPerDayCattegory[i-1].value.countCreatedTickets + newCountsPerDayCattegory[i-1].value.countOpenTickets + stock ) - newCountsPerDayCattegory[i-1].value.countSolvedTickets

                if (stock <= 0){
                    stock = 0
                }

                stockCalulations.push({datum:newCountsPerDayCattegory[i].key, createdTickets: newCountsPerDayCattegory[i].value.countCreatedTickets, opentTickets: newCountsPerDayCattegory[i].value.countOpenTickets, ticketStock: stock, solvedTickets: newCountsPerDayCattegory[i].value.countSolvedTickets })
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
            returnObject.stockValues = newCountsPerDayCattegory[0].value
            returnObject.fltrData = returnArray
            returnObject.countPerDay = countsPerDay

        }
        return returnObject
}